export class UserResponseDto {
  readonly id: number;
  readonly username: string;
  readonly email: string;
  readonly bio?: string;
  readonly image?: string;
  accessToken?: string;
}
