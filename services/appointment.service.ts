import HttpService from "@/services/http.service";

class AppointmentService extends HttpService {
  async makeAppointment(params: any) {
    return this.post<any>("/appointment", params);
  }
  
  async getAppointment(params: any) {
    return this.get('/appointment', {limit:100})
  }
}

export const appointmentService = new AppointmentService();
