export class UserResponseDto {
  readonly id: string;
  readonly username: string;
  readonly email: string;
  readonly bio?: string;
  readonly image?: string;
  accessToken?: string;
}
