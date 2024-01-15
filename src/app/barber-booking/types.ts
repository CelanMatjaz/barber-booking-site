export interface WorkHours {
    id: number;
    day: number;
    startHour: number;
    endHour: number;
    lunchTime: {
        startHour: number;
        durationMinutes: number;
    };
}

export interface Barber {
    id: number;
    firstName: string;
    lastName: string;
    workHours: WorkHours[]
}

export interface Service {
    id: number;
    name: string;
    durationMinutes: number;
    price: number;
}

export interface Appointment {
    id: number;
    startDate: number;
    barberId: number;
    serviceId: number;
}

export interface TimeEntry {
    value: number;
    label: string,
}