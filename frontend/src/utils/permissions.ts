export const hasPermission = (
  permission: string
): boolean => {
  const permissions = JSON.parse(
    localStorage.getItem("permissions") || "[]"
  );

  return permissions.includes(permission);
};