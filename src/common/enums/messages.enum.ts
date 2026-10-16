export enum publicMessages {
  OPERATION_SUCCESSFUL = 'عملیات با موفقیت انجام شد',
}

export enum drugMessages {
  DRUG_CREATED = 'دارو با موفقیت ثبت شد',
  DRUGS_FETCHED = 'لیست داروها با موفقیت دریافت شد',
  DRUG_FETCHED = 'اطلاعات دارو با موفقیت دریافت شد',
  DRUG_UPDATED = 'اطلاعات دارو با موفقیت ویرایش شد',
  DRUG_DEACTIVATED = 'دارو با موفقیت غیرفعال شد',
  DRUG_NOT_FOUND = 'دارو مورد نظر یافت نشد',
}

export enum interactionMessages {
  INTERACTION_CREATED = 'تعامل دارویی با موفقیت ثبت شد',
  INTERACTIONS_FETCHED = 'لیست تعاملات دارویی با موفقیت دریافت شد',
  INTERACTION_FETCHED = 'اطلاعات تعامل دارویی با موفقیت دریافت شد',
  INTERACTION_UPDATED = 'تعامل دارویی با موفقیت ویرایش شد',
  INTERACTION_DEACTIVATED = 'تعامل دارویی با موفقیت غیرفعال شد',
  INTERACTION_NOT_FOUND = 'تعامل دارویی مورد نظر یافت نشد',

  INTERACTION_DRUGS_MUST_DIFFER = 'دو دارو باید متفاوت باشند',
  INTERACTION_DRUG_NOT_FOUND = 'یکی از داروهای انتخاب‌شده یافت نشد',
  INTERACTION_DRUG_INACTIVE = 'ثبت تعامل برای داروی غیرفعال مجاز نیست',
  INTERACTION_ALREADY_EXISTS = 'تعامل بین این دو دارو قبلاً ثبت شده است',
}

export enum userMessages {
  USER_CREATED = 'کاربر با موفقیت ثبت شد',
  USERS_FETCHED = 'لیست کاربران با موفقیت دریافت شد',
  USER_FETCHED = 'اطلاعات کاربر با موفقیت دریافت شد',
  USER_UPDATED = 'اطلاعات کاربر با موفقیت ویرایش شد',
  USER_NOT_FOUND = 'کاربر مورد نظر یافت نشد',
  USER_DELETED = "کاربر با موفقیت حذف شد",

  USER_EMAIL_ALREADY_EXISTS = 'این ایمیل قبلاً ثبت شده است',
  USER_ACCOUNT_INACTIVE = 'حساب کاربری غیرفعال است',
  USER_INVALID_CREDENTIALS = 'ایمیل یا رمز عبور اشتباه است',
}