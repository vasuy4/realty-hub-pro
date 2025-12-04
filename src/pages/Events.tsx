import { useState } from 'react';
import { Plus, Calendar, Clock, MessageSquare, Trash2, Phone, Eye, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { formatDate } from '@/lib/utils';
import { Event } from '@/types';
import { toast } from 'sonner';

const eventTypeLabels: Record<Event['type'], { label: string; icon: any; color: string }> = {
  client_meeting: { label: 'Встреча с клиентом', icon: Users, color: 'bg-blue-100 text-blue-800' },
  showing: { label: 'Показ', icon: Eye, color: 'bg-green-100 text-green-800' },
  scheduled_call: { label: 'Запланированный звонок', icon: Phone, color: 'bg-amber-100 text-amber-800' },
};

const mockEvents: Event[] = [
  { id: '1', realtorId: '1', dateTime: new Date(), duration: 60, type: 'client_meeting', comment: 'Обсуждение условий покупки квартиры на Ленина' },
  { id: '2', realtorId: '1', dateTime: new Date(), duration: 30, type: 'showing', comment: 'Показ дома в Подольске' },
  { id: '3', realtorId: '1', dateTime: new Date(), type: 'scheduled_call', comment: 'Уточнить детали по документам' },
];

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [deleteTarget, setDeleteTarget] = useState<Event | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    dateTime: '',
    duration: '',
    type: 'client_meeting' as Event['type'],
    comment: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.dateTime) {
      toast.error('Укажите дату и время');
      return;
    }

    const newEvent: Event = {
      id: String(events.length + 1),
      realtorId: '1',
      dateTime: new Date(formData.dateTime),
      duration: formData.duration ? parseInt(formData.duration) : undefined,
      type: formData.type,
      comment: formData.comment || undefined,
    };

    setEvents(prev => [...prev, newEvent]);
    setIsDialogOpen(false);
    setFormData({ dateTime: '', duration: '', type: 'client_meeting', comment: '' });
    toast.success('Событие создано');
  };

  const confirmDelete = () => {
    if (deleteTarget) {
      setEvents(prev => prev.filter(e => e.id !== deleteTarget.id));
      toast.success('Событие отменено');
      setDeleteTarget(null);
    }
  };

  const todayEvents = events.filter(e => {
    const today = new Date();
    return e.dateTime.toDateString() === today.toDateString();
  });

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title flex items-center gap-3">
            <Calendar className="w-8 h-8" />
            События
          </h1>
          <p className="text-muted-foreground mt-1">Планировщик встреч, показов и звонков</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Новое событие
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Создать событие</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label className="form-label">Дата и время *</Label>
                <Input
                  type="datetime-local"
                  value={formData.dateTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, dateTime: e.target.value }))}
                />
              </div>

              <div>
                <Label className="form-label">Тип события *</Label>
                <Select value={formData.type} onValueChange={(v) => setFormData(prev => ({ ...prev, type: v as Event['type'] }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="client_meeting">Встреча с клиентом</SelectItem>
                    <SelectItem value="showing">Показ</SelectItem>
                    <SelectItem value="scheduled_call">Запланированный звонок</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="form-label">Длительность (мин)</Label>
                <Input
                  type="number"
                  min="1"
                  value={formData.duration}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                  placeholder="60"
                />
              </div>

              <div>
                <Label className="form-label">Комментарий</Label>
                <Textarea
                  value={formData.comment}
                  onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
                  placeholder="Описание события..."
                  rows={3}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="submit">Создать</Button>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Отмена
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Today's events */}
      <div className="mb-8">
        <h2 className="font-heading font-semibold text-lg mb-4">
          Сегодня ({formatDate(new Date())})
        </h2>
        
        {todayEvents.length === 0 ? (
          <div className="form-section text-center py-8 text-muted-foreground">
            <Calendar className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>На сегодня нет запланированных событий</p>
          </div>
        ) : (
          <div className="space-y-4">
            {todayEvents.map(event => {
              const typeInfo = eventTypeLabels[event.type];
              const Icon = typeInfo.icon;
              return (
                <div key={event.id} className="form-section p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`p-2 rounded-lg ${typeInfo.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium">{typeInfo.label}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {event.dateTime.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          {event.duration && (
                            <span>{event.duration} мин</span>
                          )}
                        </div>
                        {event.comment && (
                          <p className="text-sm mt-2 flex items-start gap-2">
                            <MessageSquare className="w-4 h-4 mt-0.5 text-muted-foreground" />
                            {event.comment}
                          </p>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteTarget(event)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* All events */}
      <div>
        <h2 className="font-heading font-semibold text-lg mb-4">Все события</h2>
        
        <div className="space-y-4">
          {events.map(event => {
            const typeInfo = eventTypeLabels[event.type];
            const Icon = typeInfo.icon;
            return (
              <div key={event.id} className="form-section p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg ${typeInfo.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium">{typeInfo.label}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span>{formatDate(event.dateTime)}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {event.dateTime.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        {event.duration && (
                          <span>{event.duration} мин</span>
                        )}
                      </div>
                      {event.comment && (
                        <p className="text-sm mt-2 text-muted-foreground">{event.comment}</p>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleteTarget(event)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Отменить событие?"
        description="Вы уверены, что хотите отменить это событие?"
        confirmLabel="Отменить событие"
        variant="destructive"
        onConfirm={confirmDelete}
      />
    </div>
  );
}
