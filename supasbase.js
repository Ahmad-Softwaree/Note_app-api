export const uploadFile = async () => {
  const { data, error } = await supabase.storage.from("Users").upload("avatar1.png", avatarFile, {
    cacheControl: "3600",
    upsert: false,
  });
};
