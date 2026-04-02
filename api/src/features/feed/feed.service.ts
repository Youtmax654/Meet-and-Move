import postgres from "postgres";

export const getAllActivities = async (databaseUrl: string) => {
  const sql = postgres(databaseUrl);

  try {
    const activities = await sql`
      SELECT 
        a.id, 
        a.title, 
        a.description, 
        a.latitude, 
        a.longitude, 
        a.max_participants, 
        a.specific_details,
        a.event_date,

        u.id as host_id, 
        u.username as host_username, 
        u.bio as host_bio,
        u.is_verified as host_is_verified,

        i.id as category_id, 
        i.name as category_name

      FROM activities a
      JOIN users u ON a.host_id = u.id
      LEFT JOIN interests i ON a.category_id = i.id
    `;

    if (activities.length === 0) return [];

    const participants = await sql`
      SELECT ap.activity_id, u.id, u.username
      FROM activity_participants ap
      JOIN users u ON ap.user_id = u.id
      WHERE ap.status = 'accepted'
    `;

    const participantsByActivity: Record<string, { id: string; username: string }[]> = {};

    for (const p of participants) {
      if (!participantsByActivity[p.activity_id]) {
        participantsByActivity[p.activity_id] = [];
      }
      participantsByActivity[p.activity_id].push({
        id: p.id,
        username: p.username,
      });
    }

    return activities.map((row) => {
      const details = row.specific_details || {};
      const activityParticipants = participantsByActivity[row.id] || [];

      return {
        id: row.id,
        title: row.title,
        description: row.description,

        // ✅ NOUVEAU
        event_date: row.event_date,
        isHostVerified: row.host_is_verified,

        price: details.price,
        difficulty: details.difficulty,
        duration_hours: details.duration_hours,

        latitude: row.latitude,
        longitude: row.longitude,

        max_participants: row.max_participants,

        enrolledCount: activityParticipants.length,
        participants: activityParticipants,

        host: {
          id: row.host_id,
          username: row.host_username,
          bio: row.host_bio,
        },

        category: {
          id: row.category_id,
          name: row.category_name,
        },

        price_breakdown: details.price_breakdown || [],
      };
    });

  } finally {
    await sql.end();
  }
};

export const getGuides = async (databaseUrl: string) => {
  const sql = postgres(databaseUrl);

  try {
    const guides = await sql`
      SELECT 
        u.id, 
        u.username, 
        u.bio,
        u.is_verified,
        COALESCE(
          string_agg(i.name, ', '),
          ''
        ) as interests
      FROM users u
      LEFT JOIN user_interests ui ON u.id = ui.user_id
      LEFT JOIN interests i ON ui.interest_id = i.id
      WHERE u.role = 'pro_guide'
      GROUP BY u.id, u.username, u.bio, u.is_verified
    `;

    return guides.map((g) => ({
      id: g.id,
      name: g.username,
      details: g.interests ? `Expert en : ${g.interests}` : g.bio || '',
      image: `https://api.dicebear.com/7.x/initials/png?seed=${encodeURIComponent(g.username)}`,
      isVerified: g.is_verified,
    }));

  } finally {
    await sql.end();
  }
};