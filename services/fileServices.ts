import request from 'utils/request';

export default {
  uploadFile: request.post<{ name: string; url: string }, { file: File }>(`todo://文件上传`, { isFormData: true }),
};
