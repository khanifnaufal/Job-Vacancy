<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\Vacancy;
use Illuminate\Foundation\Testing\RefreshDatabase;

class VacancyTest extends TestCase
{
    use RefreshDatabase;

    public function test_it_can_create_a_vacancy()
    {
        $vacancy = Vacancy::create([
            'title' => 'Software Engineer',
            'description' => 'Great job',
            'company' => 'Tech Corp',
            'location' => 'Jakarta',
            'salary' => '10000',
            'status' => true,
        ]);

        $this->assertDatabaseHas('vacancies', [
            'id' => $vacancy->id,
            'title' => 'Software Engineer'
        ]);
        $this->assertEquals('Tech Corp', $vacancy->company);
    }
}
