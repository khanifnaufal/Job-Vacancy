<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Vacancy;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        $vacancies = [
            [
                'title' => 'Senior Frontend Developer',
                'company' => 'TechNova Inc.',
                'location' => 'Jakarta, Indonesia (Remote)',
                'description' => "We are looking for an experienced Frontend Developer to lead our UI/UX implementation. You will be working heavily with Next.js, React, and TailwindCSS.\n\nQualifications:\n- 5+ years of experience with React\n- Deep understanding of modern state management \n- Experience with performance optimizations.",
                'salary' => 'Rp 20.000.000 - Rp 35.000.000',
                'status' => true,
            ],
            [
                'title' => 'Backend Engineer',
                'company' => 'FinServe Asia',
                'location' => 'Singapore (Hybrid)',
                'description' => "Join our core technical team to build scalable financial APIs. Primary stack includes Laravel, PostgreSQL, and Redis.\n\nResponsibilities:\n- Design RESTful APIs\n- Optimize database queries\n- Implement security best practices.",
                'salary' => '$5,000 - $8,000 / month',
                'status' => true,
            ],
            [
                'title' => 'UI/UX Designer',
                'company' => 'Creative Studio',
                'location' => 'Bali, Indonesia',
                'description' => "We need a visionary product designer who understands user journeys and can create stunning, intuitive interfaces using Figma.\n\nRequirements:\n- Outstanding portfolio\n- Prototyping skills\n- Understanding of design systems.",
                'salary' => 'Rp 15.000.000 - Rp 25.000.000',
                'status' => true,
            ],
            [
                'title' => 'Product Manager',
                'company' => 'Global Ventures',
                'location' => 'Remote',
                'description' => "Lead product strategy from ideation to launch. Work closely with engineering and marketing teams.\n\nRequirements:\n- 3+ years experience as PM\n- Agile/Scrum methodology\n- Strong data analysis skills.",
                'salary' => '$4,000 - $6,000 / month',
                'status' => false,
            ],
            [
                'title' => 'DevOps Engineer',
                'company' => 'CloudTech Systems',
                'location' => 'Kuala Lumpur, Malaysia',
                'description' => "Help us build, automate, and scale our infrastructure. Must have strong experience with AWS, Kubernetes, and CI/CD pipelines.\n\nResponsibilities:\n- Manage cloud infrastructure\n- Automate deployments\n- Ensure high availability and security.",
                'salary' => 'RM 12,000 - RM 18,000',
                'status' => true,
            ],
        ];

        foreach ($vacancies as $vacancy) {
            Vacancy::create($vacancy);
        }
    }
}
