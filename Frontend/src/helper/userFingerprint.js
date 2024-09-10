// export const getDeviceInfo = () => {
//     const deviceInfo = {
//       vendor: navigator.vendor,
//       browser: (() => {
//         const ua = navigator.userAgent;
//         if (ua.indexOf("Edg") > -1) return "Edge";
//         if (ua.indexOf("Firefox") > -1) return "Firefox";
//         if (ua.indexOf("SamsungBrowser") > -1) return "Samsung Internet";
//         if (ua.indexOf("OPR") > -1 || ua.indexOf("Opera") > -1) return "Opera";
//         if (ua.indexOf("Trident") > -1) return "Internet Explorer";
//         if (ua.indexOf("Chrome") > -1 && ua.indexOf("Edg") === -1)
//           return "Chrome";
//         if (
//           ua.indexOf("Safari") > -1 &&
//           ua.indexOf("Chrome") === -1 &&
//           ua.indexOf("Edg") === -1
//         )
//           return "Safari";
//         return "Unknown";
//       })(),
//       language: navigator.language,
//       platform: navigator.platform,
//       userAgent: navigator.userAgent,
//       connection: (() => {
//         const connection =
//           navigator.connection ||
//           navigator.mozConnection ||
//           navigator.webkitConnection;
//         return connection ? connection.effectiveType : "Unknown";
//       })(),
//       fontFamily: getComputedStyle(document.body).fontFamily,
//       screenWidth: window.screen.width,
//       screenHeight: window.screen.height,
//       cookieEnabled: navigator.cookieEnabled,
//       timezoneOffset: new Date().getTimezoneOffset(),
//       cpuArchitecture: (() => {
//         if (navigator.hardwareConcurrency) {
//           return `${navigator.hardwareConcurrency}-core`;
//         } else {
//           return "Unknown";
//         }
//       })(),
//       devicePixelRatio: window.devicePixelRatio,
//       screenColorDepth: window.screen.colorDepth,
//       isAndroid: (() => {
//         const ua = navigator.userAgent;
//         return ua.indexOf("Android") > -1;
//       })(),
//     };
  
//     return deviceInfo;
//   }
  
//   export const getNetworkInfo = async() => {
//     const response = await fetch("https://ipwho.is/");
//     if (!response.ok) {
//       throw new Error("Failed to fetch network information");
//     }
//     const data = await response.json();
  
//     const networkInfo = {
//       ip: data.ip,
//       timezone: data.timezone,
//       ipLocation: {
//         city: {
//           name: data.city,
//         },
//         subdivisions: {
//           code: data.region_code,
//           name: data.region,
//         },
//         country: {
//           code: data.country_code,
//           name: data.country,
//         },
//         continent: {
//           code: data.continent_code,
//         },
//         latitude: data.latitude,
//         longitude: data.longitude,
//         postalCode: data.postal,
//         callingCode: data.calling_code
//       },
//     };
  
//     return networkInfo;
//   }


export const getDeviceInfo = () => {
  const deviceInfo = {
    vendor: navigator.vendor,
    browser: (() => {
      const ua = navigator.userAgent;
      if (ua.indexOf("Edg") > -1) return "Edge";
      if (ua.indexOf("Firefox") > -1) return "Firefox";
      if (ua.indexOf("SamsungBrowser") > -1) return "Samsung Internet";
      if (ua.indexOf("OPR") > -1 || ua.indexOf("Opera") > -1) return "Opera";
      if (ua.indexOf("Trident") > -1) return "Internet Explorer";
      if (ua.indexOf("Chrome") > -1 && ua.indexOf("Edg") === -1)
        return "Chrome";
      if (
        ua.indexOf("Safari") > -1 &&
        ua.indexOf("Chrome") === -1 &&
        ua.indexOf("Edg") === -1
      )
        return "Safari";
      return "Unknown";
    })(),
    language: navigator.language,
    platform: navigator.platform,
    userAgent: navigator.userAgent,
    connection: (() => {
      const connection =
        navigator.connection ||
        navigator.mozConnection ||
        navigator.webkitConnection;
      return connection ? connection.effectiveType : "Unknown";
    })(),
    fontFamily: getComputedStyle(document.body).fontFamily,
    screenWidth: window.screen.width,
    screenHeight: window.screen.height,
    cookieEnabled: navigator.cookieEnabled,
    timezoneOffset: new Date().getTimezoneOffset(),
    cpuArchitecture: (() => {
      if (navigator.hardwareConcurrency) {
        return `${navigator.hardwareConcurrency}-core`;
      } else {
        return "Unknown";
      }
    })(),
    devicePixelRatio: window.devicePixelRatio,
    screenColorDepth: window.screen.colorDepth,
    isAndroid: (() => {
      const ua = navigator.userAgent;
      return ua.indexOf("Android") > -1;
    })(),
  };

  return deviceInfo;
}

export const getNetworkInfo = async() => {
  const response = await fetch("https://ipwho.is/");
  if (!response.ok) {
    throw new Error("Failed to fetch network information");
  }
  const data = await response.json();

  const networkInfo = {
    ip: data.ip,
    timezone: data.timezone,
    ipLocation: {
      city: {
        name: data.city,
      },
      subdivisions: {
        code: data.region_code,
        name: data.region,
      },
      country: {
        code: data.country_code,
        name: data.country,
      },
      continent: {
        code: data.continent_code,
      },
      latitude: data.latitude,
      longitude: data.longitude,
      postalCode: data.postal,
      callingCode: data.calling_code
    },
  };

  return networkInfo;
}