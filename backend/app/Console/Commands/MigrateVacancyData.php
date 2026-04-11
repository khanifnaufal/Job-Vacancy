<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class MigrateVacancyData extends Command
{
    protected $signature = 'app:migrate-vacancy-data';
    protected $description = 'Migrates existing vacancy strings to company models';

    public function handle()
    {
        $recruiter = \App\Models\User::where('role', 'recruiter')->first();

        if (!$recruiter) {
            $this->error('No recruiter found to assign companies to.');
            return;
        }

        $vacancies = \App\Models\Vacancy::whereNull('company_id')->get();

        foreach ($vacancies as $vacancy) {
            $companyName = $vacancy->company;
            
            // Find or create company for this name linked to the recruiter
            $company = \App\Models\Company::firstOrCreate(
                ['name' => $companyName],
                [
                    'email' => strtolower(str_replace(' ', '.', $companyName)) . '@example.com',
                    'location' => $vacancy->location,
                    'user_id' => $recruiter->id,
                    'description' => 'Automatically generated profile for ' . $companyName,
                ]
            );

            $vacancy->update([
                'company_id' => $company->id,
                'job_type' => 'full-time', // Defaulting
            ]);

            $this->info("Linked vacancy '{$vacancy->title}' to company '{$company->name}'");
        }

        $this->info('Migration completed successfully.');
    }
}
