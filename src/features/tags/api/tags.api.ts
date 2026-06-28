import { TagControllerService } from '@/shared/api/generated';
import type { TagRequestDto } from '@/shared/api/generated';

export const tagsApi = {
    getTags: () => {
        return TagControllerService.getTags();
    },
    createTag: (data: TagRequestDto) => {
        return TagControllerService.createTag(data);
    },
    updateTag: (id: string, data: TagRequestDto) => {
        return TagControllerService.updateTag(id, data);
    },
    deleteTag: (id: string) => {
        return TagControllerService.deleteTag(id);
    }
};
