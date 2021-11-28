import externalLinks from "../../config/external";

// This is a placeholder function for a hook that might require data loading.
// You can use this to disable navigation during data fetches.
export const fetchPlaceHolderHook = () => ({
  isFetching: false,
  data: {
    avatarLink: externalLinks.defaultProfile,
    avatarImage: "",
  },
});
