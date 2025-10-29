// Seed script to populate database with sample data
// Run with: node ./scripts/seed.js

const { createClient } = require('@supabase/supabase-js');
const seedData = require('../db/seed/seed.json');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  console.log('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log('🌱 Starting database seed...\n');

  try {
    // Seed users
    console.log('👤 Seeding users...');
    for (const user of seedData.users) {
      const { error } = await supabase.from('users').upsert(user);
      if (error && error.code !== '23505') { // Ignore duplicate key errors
        console.error('Error seeding user:', error);
      }
    }

    // Seed teams
    console.log('🏢 Seeding teams...');
    for (const team of seedData.teams) {
      const { error } = await supabase.from('teams').upsert(team);
      if (error) console.error('Error seeding team:', error);
    }

    // Seed team members
    console.log('👥 Seeding team members...');
    for (const member of seedData.team_members) {
      const { error } = await supabase.from('team_members').upsert(member);
      if (error) console.error('Error seeding member:', error);
    }

    // Seed projects
    console.log('🎬 Seeding projects...');
    for (const project of seedData.projects) {
      const { error } = await supabase.from('projects').upsert(project);
      if (error) console.error('Error seeding project:', error);
    }

    // Seed scenes
    console.log('🎭 Seeding scenes...');
    for (const scene of seedData.scenes) {
      const { error } = await supabase.from('scenes').upsert(scene);
      if (error) console.error('Error seeding scene:', error);
    }

    // Seed shots
    console.log('🎥 Seeding shots...');
    for (const shot of seedData.shots) {
      const { error } = await supabase.from('shots').upsert(shot);
      if (error) console.error('Error seeding shot:', error);
    }

    // Seed tasks
    console.log('📋 Seeding tasks...');
    for (const task of seedData.tasks) {
      const { error } = await supabase.from('tasks').upsert(task);
      if (error) console.error('Error seeding task:', error);
    }

    // Seed project blocks
    console.log('🧩 Seeding project blocks...');
    for (const block of seedData.project_blocks) {
      const { error } = await supabase.from('project_blocks').upsert(block);
      if (error) console.error('Error seeding block:', error);
    }

    console.log('\n✅ Database seed completed successfully!');
    console.log('\nAccess your demo project at: /projects/33333333-3333-3333-3333-333333333333\n');

  } catch (error) {
    console.error('❌ Error during seed:', error);
    process.exit(1);
  }
}

seed();

