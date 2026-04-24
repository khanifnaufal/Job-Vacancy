<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Vacancy extends Model
{
    protected $fillable = [
        'title',
        'description',
        'company', // Keeping for migration
        'company_id',
        'location',
        'salary',
        'status',
        'job_type',
        'experience_level',
        'deadline',
    ];

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function applications()
    {
        return $this->hasMany(Application::class);
    }

    public function bookmarks()
    {
        return $this->hasMany(Bookmark::class);
    }

    public function interviewSlots()
    {
        return $this->hasMany(InterviewSlot::class);
    }
}
