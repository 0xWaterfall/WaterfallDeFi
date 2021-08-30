export const formatAccountAddress = (address?: string | null) => {
  if (!address) return "";
  return address.substr(0, 6) + "..." + address.substr(-4, 4);
};
