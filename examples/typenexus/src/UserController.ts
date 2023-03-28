import { Controller, Get, Authorized } from 'typenexus';

@Controller('/questions')
export class UserController {
  @Authorized()
  @Get()
  public async all(): Promise<any> {
    return {
      id: 1,
      title: 'Question #1',
    };
  }
}
