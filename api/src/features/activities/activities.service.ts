import postgres from "postgres";

export const getActivityById = async (id: string, databaseUrl: string) => {
  const sql = postgres(databaseUrl);

  try {
    const result = await sql`
      SELECT 
        a.id, a.title, a.description, a.latitude, a.longitude, a.max_participants, a.specific_details,
        u.id as host_id, u.username as host_username, u.bio as host_bio,
        i.id as category_id, i.name as category_name
      FROM activities a
      JOIN users u ON a.host_id = u.id
      LEFT JOIN interests i ON a.category_id = i.id
      WHERE a.id = ${id}
    `;

    if (result.length === 0) return null;

    const row = result[0];
    const details = row.specific_details || {};

    // Récupérer la liste des participants acceptés
    const participants = await sql`
      SELECT u.id, u.username
      FROM activity_participants ap
      JOIN users u ON ap.user_id = u.id
      WHERE ap.activity_id = ${id} AND ap.status = 'accepted'
    `;

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
      enrolledCount: Number(participants.length),
      participants: participants.map(p => ({
        id: p.id,
        username: p.username
      })),
      host: {
        id: row.host_id,
        username: row.host_username,
        bio: row.host_bio,
      },
      category: {
        id: row.category_id,
        name: row.category_name,
      },
    };
  } finally {
    await sql.end();
  }
};
