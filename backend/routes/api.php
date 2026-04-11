<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\VacancyController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\RecruiterStatsController;
use App\Http\Controllers\SeekerStatsController;
use App\Http\Controllers\ApplicationController;
use App\Http\Controllers\CompanyController;
use App\Http\Controllers\UserProfileController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user()->load(['company', 'profile']);
    });
    Route::post('/logout', [AuthController::class, 'logout']);

    // Shared Profile routes
    Route::get('/profile', [UserProfileController::class, 'show']);
    Route::post('/profile', [UserProfileController::class, 'update']);

    // Recruiter-only routes
    Route::middleware('role:recruiter')->group(function () {
        Route::get('/recruiter/stats', [RecruiterStatsController::class, 'index']);
        Route::get('/recruiter/vacancies', [VacancyController::class, 'recruiterVacancies']);
        Route::post('/vacancies', [VacancyController::class, 'store']);
        Route::put('/vacancies/{vacancy}', [VacancyController::class, 'update']);
        Route::delete('/vacancies/{vacancy}', [VacancyController::class, 'destroy']);
        
        Route::get('/recruiter/applications', [ApplicationController::class, 'recruiterIndex']);
        Route::patch('/applications/{application}/status', [ApplicationController::class, 'updateStatus']);

        Route::get('/company/my', [CompanyController::class, 'myCompany']);
        Route::put('/company/my', [CompanyController::class, 'update']);
    });

    // Seeker-only routes
    Route::middleware('role:seeker')->group(function () {
        Route::get('/seeker/stats', [SeekerStatsController::class, 'index']);
        Route::get('/seeker/applications', [ApplicationController::class, 'seekerIndex']);
        Route::post('/applications', [ApplicationController::class, 'store']);
    });
});

// Public vacancy routes
Route::get('/vacancies', [VacancyController::class, 'index']);
Route::get('/vacancies/{vacancy}', [VacancyController::class, 'show']);
