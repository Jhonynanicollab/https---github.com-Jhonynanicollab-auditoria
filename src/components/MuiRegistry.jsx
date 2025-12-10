// src/components/MuiRegistry.jsx
"use client";

import * as React from "react";
import { useServerInsertedHTML } from "next/navigation";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import PropTypes from "prop-types";

// Este componente captura los estilos generados por Emotion en el servidor
// y los inyecta en el HTML para que el cliente pueda hidratar correctamente.
export default function MuiRegistry({ children }) {
  const [cache] = React.useState(() => {
    let cache = createCache({ key: "css", prepend: true });
    cache.compat = true;
    return cache;
  });

  useServerInsertedHTML(() => {
    return (
      <style
        data-emotion={`${cache.key} ${Object.keys(cache.inserted).join(" ")}`}
        dangerouslySetInnerHTML={{
          __html: Object.values(cache.inserted).join(""),
        }}
      />
    );
  });

  return <CacheProvider value={cache}>{children}</CacheProvider>;
}

MuiRegistry.propTypes = {
  children: PropTypes.node,
};