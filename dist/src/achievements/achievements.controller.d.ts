import { AchievementsService } from './achievements.service';
export declare class AchievementsController {
    private achievementsService;
    constructor(achievementsService: AchievementsService);
    getUserAchievements(req: any): Promise<any>;
    getAchievementsProgress(req: any): Promise<any>;
}
