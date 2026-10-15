export interface UserAccountResponse {
  id: string;
  userName: string;
  email: string;
  roleName: string;
}

export interface PersonalProfileResponse {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: boolean;
  address: string;
  city: string;
  country: string;
  phone: string;
  citizenCardId: string;
}

export interface UpdatePersonalProfileRequest {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: boolean;
  address: string;
  city: string;
  country: string;
  phone: string;
  citizenCardId: string;
}
