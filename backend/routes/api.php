<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\VacancyController;
use App\Http\Controllers\AuthController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user()->load(['company', 'profile']);
    });
    Route::post('/logout', [AuthController::class, 'logout']);

    // Recruiter-only routes
    Route::middleware('role:recruiter')->group(function () {
        // Stats
        Route::get('/recruiter/stats', [\App\Http\Controllers\RecruiterStatsController::class, 'index']);
        
        // Vacancy management (Override default to ensure recruiter logic)
        Route::post('/vacancies', [VacancyController::class, 'store']);
        Route::put('/vacancies/{vacancy}', [VacancyController::class, 'update']);
        Route::delete('/vacancies/{vacancy}', [VacancyController::class, 'destroy']);
        Route::get('/recruiter/vacancies', [VacancyController::class, 'recruiterVacancies']);

        // Application management
        Route::get('/recruiter/applications', [\App\Http\Controllers\ApplicationController::class, 'recruiterIndex']);
        Route::patch('/applications/{application}/status', [\App\Http\Controllers\ApplicationController::class, 'updateStatus']);

        // Company management
        Route::get('/company/my', [\App\Http\Controllers\CompanyController::class, 'myCompany']);
        Route::put('/company/my', [\App\Http\Controllers\CompanyController::class, 'update']);
    });
});

// Public vacancy routes
Route::get('/vacancies', [VacancyController::class, 'index']);
Route::get('/vacancies/{vacancy}', [VacancyController::class, 'show']);
