"use client";
import * as React from "react";
import Spaces, { type Space } from "@ably/spaces";
import { useAbly } from "ably/react";

import { getSpaceNameFromUrl } from "../utils/helpers";

// Create a context for the space instance with an undefined initial value
const SpacesContext = React.createContext<Space | undefined>(undefined);

// Define the SpaceContextProvider component that takes an example prop and children prop
const SpaceContextProvider: React.FC<{
  example: string;
  children: React.ReactNode;
}> = ({ example, children }) => {
  // Create a state for the space instance with a setter function
  const [space, setSpace] = React.useState<Space | undefined>(undefined);
  // Get the Ably client from the hook
  const client = useAbly();

  // Create a memoized instance of Spaces using the Ably client
  const spaces = React.useMemo(() => {
    return new Spaces(client);
  }, [example]);

  // Use an effect hook to get and set the space instance when the spaces instance changes
  React.useEffect(() => {
    // Declare a variable to ignore the effect if it is unmounted
    let ignore: boolean = false;
    // Get the space name from the URL using the helper function
    const spaceName = getSpaceNameFromUrl();

    // Define an async function to initialize the space instance
    const init = async () => {
      // Get the space instance by name using spaces.get method with an offline timeout option
      const spaceInstance = await spaces.get(spaceName as string, {
        offlineTimeout: 10_000,
      });

      // If the space instance exists and the space state is undefined and the effect is not ignored,
      //set the space state to the space instance
      if (spaceInstance && !space && !ignore) {
        setSpace(spaceInstance);
      }
    };

    // Invoke the init function
    init();

    // Return a cleanup function that sets ignore to true when the effect is unmounted
    return () => {
      ignore = true;
    };
  }, [spaces]);

  // Return the context provider component with the space state as value and children as content
  return (
    <SpacesContext.Provider value={space}>{children}</SpacesContext.Provider>
  );
};

// Export the SpaceContextProvider and SpacesContext components
export { SpaceContextProvider, SpacesContext };
