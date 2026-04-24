<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InterviewSlot extends Model
{
    protected $fillable = [
        'vacancy_id',
        'application_id',
        'start_time',
        'end_time',
        'status',
        'location',
    ];

    protected $casts = [
        'start_time' => 'datetime',
        'end_time' => 'datetime',
    ];

    public function vacancy()
    {
        return $this->belongsTo(Vacancy::class);
    }

    public function application()
    {
        return $this->belongsTo(Application::class);
    }

    public function scopeAvailable($query)
    {
        return $query->where('status', 'available');
    }

    public function scopeBooked($query)
    {
        return $query->where('status', 'booked');
    }
}
