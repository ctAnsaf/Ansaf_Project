export interface login {
  username: string;
  device: string;
  social_auth: string;
}
export interface user {
  id: number;
  name: string;
  email: string;
  phone: number;
  mode: string;
  verified: string;
  vendor: number;
  lastLoggedOn: string;
  city: any;
  birthday: any;
  availableCourses: number;
  units: number;
  liveclass: number;
  exams: number;
  activefrom: string;
  avatar: any;
  token: string;
}
