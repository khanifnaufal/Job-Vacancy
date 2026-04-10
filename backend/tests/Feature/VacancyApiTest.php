<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\Vacancy;

class VacancyApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_list_vacancies()
    {
        Vacancy::create([
            'title' => 'Data Scientist',
            'description' => 'Data analysis',
            'company' => 'Data Inc',
            'location' => 'Bandung'
        ]);

        $response = $this->getJson('/api/vacancies');

        $response->assertStatus(200);
        $response->assertJsonCount(1);
        $response->assertJsonFragment(['title' => 'Data Scientist']);
    }

    public function test_can_search_jobs_by_title()
    {
        Vacancy::create([
            'title' => 'React Developer',
            'description' => 'Frontend',
            'company' => 'Digital Co',
            'location' => 'Remote'
        ]);
        Vacancy::create([
            'title' => 'Vue Developer',
            'description' => 'Frontend',
            'company' => 'Digital Co',
            'location' => 'Remote'
        ]);

        $response = $this->getJson('/api/vacancies?title=React');
        $response->assertStatus(200);
        $response->assertJsonCount(1);
        $response->assertJsonFragment(['title' => 'React Developer']);
    }

    public function test_can_create_vacancy()
    {
        $data = [
            'title' => 'Frontend Developer',
            'description' => 'Build UIs',
            'company' => 'Web Studio',
            'location' => 'Remote',
            'salary' => '8000',
            'status' => true
        ];

        $response = $this->postJson('/api/vacancies', $data);

        $response->assertStatus(201);
        $this->assertDatabaseHas('vacancies', ['title' => 'Frontend Developer']);
    }

    public function test_validation_fails_on_creation()
    {
        $response = $this->postJson('/api/vacancies', []);
        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['title', 'description', 'company', 'location']);
    }

    public function test_can_get_vacancy_detail()
    {
        $vacancy = Vacancy::create([
            'title' => 'Backend Developer',
            'description' => 'PHP/Laravel',
            'company' => 'Server Co',
            'location' => 'Jakarta'
        ]);

        $response = $this->getJson('/api/vacancies/' . $vacancy->id);

        $response->assertStatus(200);
        $response->assertJsonFragment(['title' => 'Backend Developer']);
    }
}
