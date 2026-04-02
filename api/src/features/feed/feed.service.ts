import postgres from "postgres";

export const getAllActivities = async (databaseUrl: string) => {
  const sql = postgres(databaseUrl);

  try {
    // 1. Récupérer toutes les activités avec host + catégorie
    const activities = await sql`
      SELECT 
        a.id, a.title, a.description, a.latitude, a.longitude, a.max_participants, a.specific_details,
        u.id as host_id, u.username as host_username, u.bio as host_bio,
        i.id as category_id, i.name as category_name
      FROM activities a
      JOIN users u ON a.host_id = u.id
      LEFT JOIN interests i ON a.category_id = i.id
    `;

    if (activities.length === 0) return [];

    // 2. Récupérer TOUS les participants acceptés d’un coup (optimisation 🔥)
    const participants = await sql`
      SELECT ap.activity_id, u.id, u.username
      FROM activity_participants ap
      JOIN users u ON ap.user_id = u.id
      WHERE ap.status = 'accepted'
    `;

    // 3. Grouper les participants par activité
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

    // 4. Construire le résultat final
    return activities.map((row) => {
      const details = row.specific_details || {};
      const activityParticipants = participantsByActivity[row.id] || [];

      return {
        id: row.id,
        title: row.title,
        description: row.description,
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