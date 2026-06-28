import { AuthControllerService } from '@/shared/api/generated';
import type { LoginRequestDto, RegisterRequestDto } from '@/shared/api/generated';

export const authApi = {
    login: (data: LoginRequestDto) => {
        return AuthControllerService.login(data);
    },
    register: (data: RegisterRequestDto) => {
        return AuthControllerService.register(data);
    },
    logout: () => {
        return AuthControllerService.logout();
    },
    profile: () => {
        return AuthControllerService.profile();
    }
};
