'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { PageHeader } from '@/components/layout/page-header';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useApp } from '@/lib/app-context';
import { Bus, Download, Plus, MapPin, Clock, AlertTriangle, Phone, Navigation, Users, Route as RouteIcon } from 'lucide-react';
import { transportRoutes, vehicles, students } from '@/lib/mock-data';

export default function TransportPage() {
  const { role } = useApp();
  const searchParams = useSearchParams();
  const isAdmin = role === 'school_admin' || role === 'super_admin';
  const isParentOrStudent = role === 'parent' || role === 'student';
  const [selectedRoute, setSelectedRoute] = useState(transportRoutes[0].id);
  const [liveProgress, setLiveProgress] = useState<Record<string, number>>(
    transportRoutes.reduce((acc, r) => ({ ...acc, [r.id]: r.progress }), {})
  );

  useEffect(() => {
    const qRouteId = searchParams.get('routeId');
    const qTab = searchParams.get('tab');
    if (qRouteId) {
      const match = transportRoutes.find(r => r.id === qRouteId);
      if (match) setSelectedRoute(match.id);
    }
    // tab=live-map just scrolls to the map; routes/vehicles could select route
  }, [searchParams]);

  // Simulate live GPS movement
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveProgress(prev => {
        const next = { ...prev };
        for (const r of transportRoutes) {
          next[r.id] = Math.min(100, (next[r.id] || 0) + 0.5);
        }
        return next;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const route = transportRoutes.find(r => r.id === selectedRoute);
  const routeStudents = students.filter(s => s.routeId === selectedRoute);
  const totalCapacity = transportRoutes.reduce((s, r) => s + r.capacity, 0);
  const totalOccupied = transportRoutes.reduce((s, r) => s + r.occupied, 0);

  // Check for expiring documents
  const vehicleAlerts = vehicles.filter(v => {
    const insExp = new Date(v.insuranceExpiry);
    const maintExp = new Date(v.maintenanceDue);
    const now = new Date();
    const days = (d: Date) => Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return days(insExp) < 30 || days(maintExp) < 30;
  });

  return (
    <div className="animate-fade-in">
      <PageHeader
        title="Transport & GPS"
        description="Route management, live GPS tracking, and vehicle maintenance"
        icon={Bus}
        iconColor="text-teal-600"
        iconBg="bg-teal-50"
        actions={
          <>
            <Button variant="outline" size="sm" className="gap-2"><Download className="h-4 w-4" /><span className="hidden sm:inline">Export</span></Button>
            {isAdmin && <Button size="sm" className="gap-2 bg-teal-600 hover:bg-teal-700"><Plus className="h-4 w-4" /> Add Route</Button>}
          </>
        }
      />

      <div className="space-y-4 p-4 md:p-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <Card className="p-3"><p className="text-xs text-slate-500">Active Routes</p><p className="text-xl font-bold text-teal-600">{transportRoutes.length}</p></Card>
          <Card className="p-3"><p className="text-xs text-slate-500">Total Capacity</p><p className="text-xl font-bold text-slate-900">{totalCapacity}</p></Card>
          <Card className="p-3"><p className="text-xs text-slate-500">Students Assigned</p><p className="text-xl font-bold text-slate-900">{totalOccupied}</p></Card>
          <Card className="p-3"><p className="text-xs text-slate-500">Maintenance Alerts</p><p className="text-xl font-bold text-amber-600">{vehicleAlerts.length}</p></Card>
        </div>

        {/* Live GPS Map View (Mock) */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2"><Navigation className="h-4 w-4 text-teal-600" /> Live GPS Tracking</h3>
            <Badge variant="outline" className="text-[10px] border-teal-200 text-teal-600"><span className="mr-1 flex h-1.5 w-1.5 rounded-full bg-teal-500 animate-pulse" /> Live</Badge>
          </div>
          <div className="relative h-64 rounded-lg overflow-hidden bg-gradient-to-br from-teal-50 to-cyan-50 border border-teal-100">
            {/* Mock map grid */}
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(#94a3b8 1px, transparent 1px), linear-gradient(90deg, #94a3b8 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
            {/* Route paths (mock) */}
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
              <path d="M 50,200 Q 150,100 300,150 T 500,80" stroke="#14b8a6" strokeWidth="2" fill="none" strokeDasharray="5 5" opacity="0.5" />
              <path d="M 80,50 Q 200,200 350,120 T 520,200" stroke="#3b82f6" strokeWidth="2" fill="none" strokeDasharray="5 5" opacity="0.5" />
              <path d="M 30,150 Q 120,180 250,100 T 480,60" stroke="#f59e0b" strokeWidth="2" fill="none" strokeDasharray="5 5" opacity="0.5" />
            </svg>
            {/* Bus markers */}
            {transportRoutes.map((r, i) => {
              const positions = [{ top: '30%', left: '45%' }, { top: '55%', left: '65%' }, { top: '20%', left: '70%' }];
              const pos = positions[i % positions.length];
              return (
                <div key={r.id} className="absolute flex flex-col items-center" style={pos}>
                  <div className="relative">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-600 text-white shadow-lg animate-bounce" style={{ animationDuration: '2s' }}>
                      <Bus className="h-4 w-4" />
                    </div>
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="absolute h-full w-full rounded-full bg-teal-400 animate-ping opacity-75" />
                      <span className="h-3 w-3 rounded-full bg-teal-500" />
                    </span>
                  </div>
                  <div className="mt-1 rounded bg-white px-2 py-0.5 text-[10px] font-semibold text-teal-700 shadow">{r.vehicleNo}</div>
                </div>
              );
            })}
            {/* Stop markers */}
            {route?.stops.map((stop, i) => {
              const positions = [{ top: '25%', left: '20%' }, { top: '45%', left: '50%' }, { top: '70%', left: '80%' }];
              const pos = positions[i % positions.length];
              return (
                <div key={stop.id} className="absolute" style={pos}>
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white border-2 border-teal-500">
                    <MapPin className="h-3 w-3 text-teal-600" />
                  </div>
                  <div className="absolute top-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-white px-1.5 py-0.5 text-[9px] font-medium text-slate-600 shadow">{stop.name}</div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Route List */}
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {transportRoutes.map(r => (
            <Card key={r.id} className={cn('p-4 cursor-pointer transition-all', selectedRoute === r.id ? 'border-teal-400 ring-1 ring-teal-200' : 'hover:border-slate-300')} onClick={() => setSelectedRoute(r.id)}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-50"><RouteIcon className="h-4 w-4 text-teal-600" /></div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{r.name}</p>
                    <p className="text-xs text-slate-400">{r.vehicleNo}</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-[10px] border-teal-200 text-teal-600"><span className="mr-1 flex h-1.5 w-1.5 rounded-full bg-teal-500 animate-pulse" /> {Math.round(liveProgress[r.id])}%</Badge>
              </div>
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1"><span>Route Progress</span><span>{r.occupied}/{r.capacity} students</span></div>
                <div className="h-2 w-full rounded-full bg-slate-100"><div className="h-2 rounded-full bg-teal-500 transition-all duration-1000" style={{ width: `${liveProgress[r.id]}%` }} /></div>
              </div>
              <div className="mt-2 flex items-center gap-1 text-xs text-slate-400"><MapPin className="h-3 w-3" /> {r.stops.length} stops</div>
            </Card>
          ))}
        </div>

        {/* Selected Route Details */}
        {route && (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {/* Stops */}
            <Card className="p-4">
              <h3 className="text-sm font-semibold text-slate-800 mb-3">Stops & Timings</h3>
              <div className="space-y-2">
                {route.stops.map((stop, i) => (
                  <div key={stop.id} className="flex items-center gap-3">
                    <div className="flex flex-col items-center">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-100 text-xs font-bold text-teal-700">{i + 1}</div>
                      {i < route.stops.length - 1 && <div className="w-px h-8 bg-slate-200" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-800">{stop.name}</p>
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Pickup: {stop.pickupTime}</span>
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Drop: {stop.dropTime}</span>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-slate-700">₹{stop.fare.toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Vehicle & Driver Info */}
            <Card className="p-4">
              <h3 className="text-sm font-semibold text-slate-800 mb-3">Vehicle & Driver Information</h3>
              {vehicles.map(v => {
                if (v.number !== route.vehicleNo) return null;
                const insExp = new Date(v.insuranceExpiry);
                const maintExp = new Date(v.maintenanceDue);
                const now = new Date();
                const daysLeft = (d: Date) => Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                const insDays = daysLeft(insExp);
                const maintDays = daysLeft(maintExp);
                return (
                  <div key={v.id} className="space-y-3">
                    <div className="flex items-center gap-3 rounded-lg border border-slate-100 p-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50"><Bus className="h-5 w-5 text-teal-600" /></div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{v.number}</p>
                        <p className="text-xs text-slate-500">{v.type} · {v.capacity} seats</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-lg border border-slate-100 p-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100"><Phone className="h-5 w-5 text-slate-600" /></div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{v.driverName}</p>
                        <p className="text-xs text-slate-500">{v.driverPhone}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className={cn('flex items-center justify-between rounded-lg p-2.5 text-sm', insDays < 30 ? 'bg-amber-50' : 'bg-slate-50')}>
                        <span className="text-slate-600">Insurance Expiry</span>
                        <span className={cn('font-semibold', insDays < 30 ? 'text-amber-600' : 'text-slate-700')}>{v.insuranceExpiry} ({insDays}d)</span>
                      </div>
                      <div className={cn('flex items-center justify-between rounded-lg p-2.5 text-sm', maintDays < 30 ? 'bg-amber-50' : 'bg-slate-50')}>
                        <span className="text-slate-600">Maintenance Due</span>
                        <span className={cn('font-semibold', maintDays < 30 ? 'text-amber-600' : 'text-slate-700')}>{v.maintenanceDue} ({maintDays}d)</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </Card>
          </div>
        )}

        {/* Assigned Students */}
        {isAdmin && route && (
          <Card className="p-4">
            <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2"><Users className="h-4 w-4 text-teal-600" /> Students on {route.name}</h3>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {routeStudents.map(s => (
                <div key={s.id} className="flex items-center gap-3 rounded-lg border border-slate-100 p-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-600">{s.avatar}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{s.name}</p>
                    <p className="text-xs text-slate-400">Stop: {route.stops.find(st => st.id === s.stopId)?.name || 'N/A'}</p>
                  </div>
                </div>
              ))}
              {routeStudents.length === 0 && <p className="text-sm text-slate-400 text-center py-4">No students assigned to this route</p>}
            </div>
          </Card>
        )}

        {/* Parent View: Track My Child's Bus */}
        {isParentOrStudent && (
          <Card className="p-4">
            <h3 className="text-sm font-semibold text-slate-800 mb-3 flex items-center gap-2"><MapPin className="h-4 w-4 text-teal-600" /> Track My Child's Bus</h3>
            <div className="rounded-lg bg-teal-50 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Bus className="h-6 w-6 text-teal-600" />
                  <div>
                    <p className="text-sm font-semibold text-teal-800">{transportRoutes[0].name}</p>
                    <p className="text-xs text-teal-600">{transportRoutes[0].vehicleNo}</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-[10px] border-teal-300 text-teal-700"><span className="mr-1 flex h-1.5 w-1.5 rounded-full bg-teal-500 animate-pulse" /> On Route</Badge>
              </div>
              <div className="h-3 w-full rounded-full bg-teal-100 mb-2"><div className="h-3 rounded-full bg-teal-500 transition-all duration-1000" style={{ width: `${liveProgress[transportRoutes[0].id]}%` }} /></div>
              <div className="flex items-center justify-between text-xs text-teal-700">
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> ETA: 15 min</span>
                <span>{Math.round(liveProgress[transportRoutes[0].id])}% complete</span>
              </div>
              <div className="mt-3 flex items-center gap-2 text-xs text-teal-600">
                <MapPin className="h-3 w-3" />
                <span>Next stop: {transportRoutes[0].stops[1].name} · {transportRoutes[0].stops[1].dropTime}</span>
              </div>
            </div>
          </Card>
        )}

        {/* Alerts */}
        {isAdmin && vehicleAlerts.length > 0 && (
          <Card className="p-4 border-amber-200">
            <h3 className="text-sm font-semibold text-amber-700 mb-3 flex items-center gap-2"><AlertTriangle className="h-4 w-4" /> Maintenance & Document Alerts</h3>
            <div className="space-y-2">
              {vehicleAlerts.map(v => (
                <div key={v.id} className="flex items-center gap-3 rounded-lg bg-amber-50 p-2.5">
                  <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0" />
                  <p className="text-sm text-amber-700"><span className="font-semibold">{v.number}</span> — Insurance expires on {v.insuranceExpiry}, Maintenance due on {v.maintenanceDue}</p>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
