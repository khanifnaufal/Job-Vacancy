'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { InterviewSlot, Vacancy } from '@/types';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Plus, 
  Trash2, 
  Loader2, 
  ChevronLeft,
  Users,
  CheckCircle2,
  X
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import Link from 'next/link';

export default function ManageInterviewsPage() {
  const params = useParams();
  const id = params.id as string;
  const queryClient = useQueryClient();
  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSlot, setNewSlot] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    start_time: '09:00',
    end_time: '10:00',
    location: '',
  });

  const { data: vacancy, isLoading: isLoadingVacancy } = useQuery({
    queryKey: ['vacancy', id],
    queryFn: async () => {
      const { data } = await api.get(`/vacancies/${id}`);
      return data as Vacancy;
    }
  });

  const { data: slots, isLoading: isLoadingSlots } = useQuery({
    queryKey: ['interview-slots', id],
    queryFn: async () => {
      const { data } = await api.get(`/vacancies/${id}/slots`);
      return data as InterviewSlot[];
    }
  });

  const createMutation = useMutation({
    mutationFn: async (slotsData: any[]) => {
      const { data } = await api.post(`/vacancies/${id}/slots`, { slots: slotsData });
      return data;
    },
    onSuccess: () => {
      toast.success('Interview slot created');
      queryClient.invalidateQueries({ queryKey: ['interview-slots', id] });
      setIsModalOpen(false);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to create slot');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (slotId: number) => {
      await api.delete(`/slots/${slotId}`);
    },
    onSuccess: () => {
      toast.success('Slot deleted');
      queryClient.invalidateQueries({ queryKey: ['interview-slots', id] });
    }
  });

  const handleAddSlot = (e: React.FormEvent) => {
    e.preventDefault();
    const startTime = `${newSlot.date} ${newSlot.start_time}:00`;
    const endTime = `${newSlot.date} ${newSlot.end_time}:00`;
    
    createMutation.mutate([{
      start_time: startTime,
      end_time: endTime,
      location: newSlot.location
    }]);
  };

  if (isLoadingVacancy || isLoadingSlots) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Loading Management Panel...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-indigo-400 font-bold text-sm mb-4 hover:underline"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Vacancies
          </button>
          <h1 className="text-3xl font-black text-white tracking-tight">Interview Management</h1>
          <p className="text-slate-500 font-medium mt-1">{vacancy?.title}</p>
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-indigo-600 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-500/20 hover:bg-indigo-500 transition-all hover:-translate-y-1"
        >
          <Plus className="w-5 h-5" />
          <span>Add Availability</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Stats */}
        <div className="lg:col-span-1 space-y-6">
          <div className="p-8 rounded-[2rem] bg-slate-900 border border-slate-800 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-all" />
            <div className="relative z-10 flex items-center gap-6">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 border border-indigo-500/20">
                <Calendar className="w-7 h-7" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Total Slots</p>
                <p className="text-3xl font-black text-white">{slots?.length || 0}</p>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-[2rem] bg-slate-900 border border-slate-800 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all" />
            <div className="relative z-10 flex items-center gap-6">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">Booked Slots</p>
                <p className="text-3xl font-black text-white">
                  {slots?.filter(s => s.status === 'booked').length || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Slot List */}
        <div className="lg:col-span-2">
          {slots?.length === 0 ? (
            <div className="p-20 border-2 border-dashed border-slate-800 rounded-[3rem] text-center space-y-6">
               <div className="w-20 h-20 rounded-full bg-slate-950 flex items-center justify-center mx-auto text-slate-800">
                 <Clock className="w-10 h-10" />
               </div>
               <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No interview slots scheduled yet</p>
               <button 
                 onClick={() => setIsModalOpen(true)}
                 className="text-indigo-400 font-black text-sm hover:underline"
               >
                 Create your first availability
               </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {slots?.map((slot) => (
                <div 
                  key={slot.id}
                  className={`p-6 rounded-3xl border transition-all flex items-center justify-between gap-6 ${
                    slot.status === 'booked' 
                      ? 'bg-emerald-500/5 border-emerald-500/20' 
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-6">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${
                      slot.status === 'booked' 
                        ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' 
                        : 'bg-slate-950 text-slate-500 border-slate-800'
                    }`}>
                      {slot.status === 'booked' ? <Users className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-lg font-black text-white">
                          {format(new Date(slot.start_time), 'HH:mm')} - {format(new Date(slot.end_time), 'HH:mm')}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          slot.status === 'booked' ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {slot.status}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                        {format(new Date(slot.start_time), 'EEEE, MMMM do yyyy')}
                      </p>
                      {slot.location && (
                         <p className="text-[10px] text-slate-600 mt-2 flex items-center gap-2">
                           <MapPin className="w-3 h-3" />
                           {slot.location}
                         </p>
                      )}
                    </div>
                  </div>

                  {slot.status === 'available' && (
                    <button 
                      onClick={() => deleteMutation.mutate(slot.id)}
                      className="p-3 rounded-xl bg-slate-950 text-slate-600 hover:text-rose-500 hover:bg-rose-500/10 border border-slate-800 transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Slot Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 md:p-10">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black text-white tracking-tight">Add Availability</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleAddSlot} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Interview Date</label>
                  <input 
                    type="date"
                    required
                    value={newSlot.date}
                    onChange={(e) => setNewSlot({...newSlot, date: e.target.value})}
                    className="w-full px-5 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-indigo-500/50 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Start Time</label>
                    <input 
                      type="time"
                      required
                      value={newSlot.start_time}
                      onChange={(e) => setNewSlot({...newSlot, start_time: e.target.value})}
                      className="w-full px-5 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-indigo-500/50 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">End Time</label>
                    <input 
                      type="time"
                      required
                      value={newSlot.end_time}
                      onChange={(e) => setNewSlot({...newSlot, end_time: e.target.value})}
                      className="w-full px-5 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-indigo-500/50 outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Location or Meeting Link</label>
                  <input 
                    type="text"
                    placeholder="e.g. Zoom link or Office address"
                    value={newSlot.location}
                    onChange={(e) => setNewSlot({...newSlot, location: e.target.value})}
                    className="w-full px-5 py-3 rounded-2xl bg-slate-950 border border-slate-800 text-white focus:ring-2 focus:ring-indigo-500/50 outline-none"
                  />
                </div>

                <button 
                  type="submit"
                  disabled={createMutation.isPending}
                  className="w-full py-4 rounded-2xl bg-indigo-600 text-white font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-indigo-500/20 hover:bg-indigo-500 transition-all active:scale-95"
                >
                  {createMutation.isPending ? 'Creating...' : 'Create Availability Slot'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
