'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { InterviewSlot } from '@/types';
import { toast } from 'sonner';
import { Calendar, Clock, MapPin, CheckCircle2, X } from 'lucide-react';
import { format } from 'date-fns';

interface InterviewBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  vacancyId: number;
  jobTitle: string;
}

export default function InterviewBookingModal({ isOpen, onClose, vacancyId, jobTitle }: InterviewBookingModalProps) {
  const queryClient = useQueryClient();
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);

  const { data: slots, isLoading } = useQuery({
    queryKey: ['interview-slots', vacancyId],
    queryFn: async () => {
      const { data } = await api.get(`/vacancies/${vacancyId}/slots`);
      return data as InterviewSlot[];
    },
    enabled: isOpen,
  });

  const bookMutation = useMutation({
    mutationFn: async (slotId: number) => {
      const { data } = await api.post(`/slots/${slotId}/book`);
      return data;
    },
    onSuccess: () => {
      toast.success('Interview booked successfully!');
      queryClient.invalidateQueries({ queryKey: ['seeker-applications'] });
      onClose();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to book interview');
    },
  });

  if (!isOpen) return null;

  const availableSlots = slots?.filter(s => s.status === 'available') || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-card/90 border border-border rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        
        <div className="p-8 md:p-10 relative z-10">
          <div className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-3xl font-black text-foreground tracking-tight mb-2">Book Your Interview</h2>
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">
                {jobTitle}
              </p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-foreground transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
               <div className="w-12 h-12 rounded-full border-2 border-t-indigo-500 animate-spin" />
            </div>
          ) : availableSlots.length === 0 ? (
            <div className="text-center py-16 bg-slate-50 dark:bg-slate-900/50 rounded-3xl border border-dashed border-border">
              <Calendar className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-500 font-medium">No available slots at the moment.</p>
              <p className="text-slate-400 text-xs mt-1 uppercase tracking-widest">Please check back later or contact the recruiter.</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {availableSlots.map((slot) => (
                  <button
                    key={slot.id}
                    onClick={() => setSelectedSlot(slot.id)}
                    className={`p-5 rounded-2xl border-2 transition-all text-left group relative overflow-hidden ${
                      selectedSlot === slot.id 
                        ? 'border-indigo-600 bg-indigo-600/5 shadow-lg shadow-indigo-500/10' 
                        : 'border-border bg-background hover:border-indigo-500/30'
                    }`}
                  >
                    {selectedSlot === slot.id && (
                      <div className="absolute top-3 right-3 text-indigo-600">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                    )}
                    
                    <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 mb-3">
                      <Calendar className="w-4 h-4" />
                      <span className="text-xs font-black uppercase tracking-widest">
                        {format(new Date(slot.start_time), 'EEEE, MMM do')}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-3 mb-4">
                      <Clock className="w-5 h-5 text-indigo-500" />
                      <span className="text-lg font-black text-foreground">
                        {format(new Date(slot.start_time), 'HH:mm')} - {format(new Date(slot.end_time), 'HH:mm')}
                      </span>
                    </div>

                    {slot.location && (
                      <div className="flex items-start gap-3 text-slate-500">
                        <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                        <span className="text-xs font-medium line-clamp-2">{slot.location}</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>

              <div className="pt-6 flex justify-end">
                <button
                  disabled={!selectedSlot || bookMutation.isPending}
                  onClick={() => selectedSlot && bookMutation.mutate(selectedSlot)}
                  className={`px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                    selectedSlot 
                      ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/20 hover:scale-105 active:scale-95' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {bookMutation.isPending ? 'Booking...' : 'Confirm Booking'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
