import HttpService from "@/services/http.service";

class AppointmentService extends HttpService {
  async makeAppointment(params: any) {
    return this.post<any>("/appointment", params);
  }
  
  async getAppointment(params: any) {
    return (await this.get('/appointment', {limit:100}))?.data
  }
}

export const appointmentService = new AppointmentService();
