export enum AppEnum {
  USER_LANG = 'user_lang',
  USER_TOKEN = 'woorky_admin_token',
  USER_TOKEN_EXPIRE = 'woorky_admin_token_expires_in',
  USER_DATA = 'woorky_admin_user_data',
  REFRESH_TOKEN = 'woorky_admin_refresh_token',
  REFRESH_TOKEN_EXPIRE = 'woorky_admin_refresh_token_expires_in',
}

export enum FilesTypes {
  img_document = 'image/jpeg, image/png, image/jpg, application/pdf',
  img_only = 'image/jpeg, image/png, image/jpg',
  document_only = 'application/pdf',
  img_document_json = 'image/jpeg, image/png, image/jpg, application/pdf, application/json',
}

export enum ScheduleEventStatus {
  QUEUED = 'queued',
  CANCELED = 'canceled',
  IN_PROGRESS = 'in-progress',
  FINISHED = 'finished',
  MISSED = 'missed',
}
