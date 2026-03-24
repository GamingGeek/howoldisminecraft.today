import humanize from "humanize-duration";

export interface VersionManifest {
  latest: Latest;
  versions: Version[];
}

export interface Latest {
  release: string;
  snapshot: string;
}

export interface Version {
  id: string;
  type: Type;
  url: string;
  time: string;
  releaseTime: string;
  sha1: string;
  complianceLevel: number;
}

export type Type = "snapshot" | "release" | "old_beta" | "old_alpha";

const versionPrefixes = ["a", "b"];

const getTypePrefix = (type: Type) => {
  switch (type) {
    case "snapshot":
      return " Snapshot";
    case "release":
      return "";
    case "old_beta":
      return " Beta";
    case "old_alpha":
      return " Alpha";
  }
};

const dateFixes: Record<string, string> = {
  "1.20.3": "2023-12-05T00:00:00.000Z",
  "23w43b": "2023-10-27T00:00:00.000Z",
  "1.20.2": "2023-09-21T00:00:00.000Z",
  "23w31a": "2023-08-02T00:00:00.000Z",
  "1.20": "2023-06-07T00:00:00.000Z",
  "1.19.2-rc2": "2022-08-05T00:00:00.000Z",
  "1.16.5": "2021-01-15T00:00:00.000Z",
  "1.16.4": "2020-11-02T00:00:00.000Z",
  "1.16.4-pre1": "2020-10-15T00:00:00.000Z",
  "1.15.2": "2020-01-21T00:00:00.000Z",
  "1.15.1": "2019-12-17T00:00:00.000Z",
  "1.15": "2019-12-10T00:00:00.000Z",
  "18w30b": "2018-07-25T00:00:00.000Z",
  "18w22b": "2018-05-20T00:00:00.000Z",
  "1.12": "2017-06-7T00:00:00.000Z",
  "1.8.9": "2015-12-09T00:00:00.000Z",
  "1.8.8": "2015-07-28T00:00:00.000Z",
  "1.8.2-pre5": "2015-01-28T00:00:00.000Z",
  "1.8-pre1": "2014-08-22T00:00:000Z",
  "1.7.10": "2014-06-26T00:00:00.000Z",
  "1.7.10-pre4": "2014-06-18T00:00:00.000Z",
  "1.7.10-pre3": "2014-06-10T00:00:00.000Z",
  "1.7.10-pre2": "2014-06-04T00:00:00.000Z",
  "1.7.10-pre1": "2014-06-03T00:00:00.000Z",
  "14w11b": "2014-03-13T00:00:00.000Z",
  "1.7.8": "2014-04-11T00:00:00.000Z",
  "1.7.6-pre2": "2014-04-04T00:00:00.000Z",
  "1.7.6-pre1": "2014-04-03T00:00:00.000Z",
  "14w08a": "2014-02-19T00:00:00.000Z",
  "14w02c": "2014-01-09T00:00:00.000Z",
  "1.7.4": "2013-12-10T00:00:00.000Z",
  "13w38b": "2013-09-19T00:00:00.000Z",
  "1.6.3": "2013-09-13T00:00:00.000Z",
  "1.6.2": "2013-07-08T00:00:00.000Z",
  "1.6.1": "2013-07-01T00:00:00.000Z",
  "13w23b": "2013-06-07T00:00:00.000Z",
  "13w18c": "2013-05-02T00:00:00.000Z",
  "1.5.2": "2013-05-02T00:00:00.000Z",
  "13w16a": "2013-04-18T00:00:00.000Z",
  "1.5.1": "2013-03-21T00:00:00.000Z",
  "1.5": "2013-03-13T00:00:00.000Z",
  "1.4.7": "2013-01-09T00:00:00.000Z",
  "1.4.5": "2012-11-19T00:00:00.000Z",
  "1.4.6": "2012-12-20T00:00:00.000Z",
  "1.4.4": "2012-11-14T00:00:00.000Z",
  "1.4.3": "2012-11-01T00:00:00.000Z",
  "1.4.2": "2012-10-25T00:00:00.000Z",
  "1.4.1": "2012-10-23T00:00:00.000Z",
  "1.4": "2012-10-19T00:00:00.000Z",
  "1.3.2": "2012-08-16T00:00:00.000Z",
  "1.3.1": "2012-08-01T00:00:00.000Z",
  "1.3": "2012-07-26T00:00:00.000Z",
  "1.2.5": "2012-04-04T00:00:00.000Z",
  "1.2.4": "2012-03-22T00:00:00.000Z",
  "1.2.3": "2012-03-02T00:00:00.000Z",
  "1.2.2": "2012-03-01T00:00:00.000Z",
  "1.2.1": "2012-03-01T00:00:00.000Z",
  "1.1": "2012-01-12T00:00:00.000Z",
  "1.0": "2011-11-18T00:00:00.000Z",
  "b1.8.1": "2011-09-15T00:00:00.000Z",
  "b1.7.3": "2011-07-08T00:00:00.000Z",
  "b1.7.2": "2011-07-01T00:00:00.000Z",
  "b1.7": "2011-06-30T00:00:00.000Z",
  "b1.6.6": "2011-05-31T00:00:00.000Z",
  "b1.6.5": "2011-05-28T00:00:00.000Z",
  "b1.6.4": "2011-05-26T00:00:00.000Z",
  "b1.6.3": "2011-05-26T00:00:00.000Z",
  "b1.6.2": "2011-05-26T00:00:00.000Z",
  "b1.6.1": "2011-05-26T00:00:00.000Z",
  "b1.6": "2011-05-26T00:00:00.000Z",
  "b1.5_01": "2011-04-20T00:00:00.000Z",
  "b1.5": "2011-04-19T00:00:00.000Z",
  "b1.4_01": "2011-04-05T00:00:00.000Z",
  "b1.4": "2011-04-01T00:00:00.000Z",
  "b1.3_01": "2011-02-23T00:00:00.000Z",
  "b1.3b": "2011-02-22T00:00:00.000Z",
  "b1.2_02": "2011-01-21T00:00:00.000Z",
  "b1.2_01": "2011-01-14T00:00:00.000Z",
  "b1.2": "2011-01-13T00:00:00.000Z",
  "b1.1_02": "2010-12-22T00:00:00.000Z",
  "b1.1_01": "2010-12-22T00:00:00.000Z",
  "b1.0.2": "2010-12-21T00:00:00.000Z",
  "b1.0_01": "2010-12-20T00:00:00.000Z",
  "b1.0": "2010-12-20T00:00:00.000Z",
  "a1.2.6": "2010-12-03T00:00:00.000Z",
  "a1.2.5": "2010-12-01T00:00:00.000Z",
  "a1.2.4_01": "2010-11-30T00:00:00.000Z",
  "a1.2.3_04": "2010-11-26T00:00:00.000Z",
  "a1.2.3_02": "2010-11-25T00:00:00.000Z",
  "a1.2.3_01": "2010-11-24T00:00:00.000Z",
  "a1.2.3": "2010-11-24T00:00:00.000Z",
  "a1.2.2b": "2010-11-10T00:00:00.000Z",
  "a1.2.2a": "2010-11-10T00:00:00.000Z",
  "a1.2.1_01": "2010-11-05T00:00:00.000Z",
  "a1.2.1": "2010-11-05T00:00:00.000Z",
  "a1.2.0_02": "2010-10-31T00:00:00.000Z",
  "a1.2.0": "2010-10-30T00:00:00.000Z",
  "a1.1.2_01": "2010-09-23T00:00:00.000Z",
  "a1.1.2": "2010-09-18T00:00:00.000Z",
  "a1.1.0": "2010-09-10T00:00:00.000Z",
  "a1.0.17_04": "2010-08-23T00:00:00.000Z",
  "a1.0.17_02": "2010-08-20T00:00:00.000Z",
  "a1.0.16": "2010-08-12T00:00:00.000Z",
  "a1.0.14": "2010-07-30T00:00:00.000Z",
  "a1.0.11": "2010-07-23T00:00:00.000Z",
  "a1.0.5_01": "2010-07-14T00:00:00.000Z",
  "a1.0.4": "2010-07-09T00:00:00.000Z",
  "inf-20100618": "2010-06-18T00:00:00.000Z",
  "c0.30_01c": "2009-11-10T00:00:00.000Z",
  "c0.0.13a_03": "2009-05-22T00:00:00.000Z",
  "c0.0.13a": "2009-05-22T00:00:00.000Z",
  "c0.0.11a": "2009-05-17T00:00:00.000Z",
  "rd-161348": "2009-05-16T00:00:00.000Z",
  "rd-160052": "2009-05-15T00:00:00.000Z",
  "rd-20090515": "2009-05-15T00:00:00.000Z",
  "rd-132328": "2009-05-13T00:00:00.000Z",
  "rd-132211": "2009-05-13T00:00:00.000Z",
};

const bypassCacheVersions = ["26.2-snapshot-1"];

let cachedManifest: VersionManifest | null = null;
let lastFetch: number = 0;

const fetchManifest = async (version?: string) => {
  const needsRefetch =
    !cachedManifest ||
    Date.now() - lastFetch >= 1000 * 60 * 60 ||
    (version &&
      bypassCacheVersions.includes(version) &&
      !cachedManifest.versions.find((v) => v.id === version));

  if (!needsRefetch) {
    return cachedManifest;
  }

  const response = await fetch(
    "https://piston-meta.mojang.com/mc/game/version_manifest_v2.json",
  );
  if (response.ok) {
    const manifest = (await response.json()) as VersionManifest;
    const versions = [...manifest.versions];
    for (const version of versions) {
      if (version.id.includes(" Pre-Release ")) {
        manifest.versions.splice(manifest.versions.indexOf(version), 0, {
          ...version,
          id: version.id.replace(" Pre-Release ", "-pre"),
        });
      }
    }
    cachedManifest = manifest;
    lastFetch = Date.now();
    return manifest;
  }
  return cachedManifest;
};

const sendError = (title: string, text: string, code: number) => {
  return new Response(
    `<html>
  <head>
    <title>${title}</title>
    <style>
      body { text-align: center; padding-top: 20vh; }
      @media (prefers-color-scheme: dark) { body { background: black; color: white; } }
    </style>
  </head>
  <body>
    <h1>${title}</h1>
    <p>${text}</p>
    <a href="https://minecraft.net/">Go to Minecraft.net</a>
  </body>
</html>`,
    {
      status: code,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    },
  );
};

export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    let version = url.pathname.slice(1);

    const manifest = await fetchManifest(version);
    if (!manifest) {
      return sendError(
        "Internal Server Error",
        "Failed to fetch version manifest from Mojang",
        500,
      );
    }

    if (!version) version = manifest.latest.release;
    else if (version === "snapshot") version = manifest.latest.snapshot;

    const versionEntry = manifest.versions.find(
      (v) =>
        v.id === version ||
        (versionPrefixes.includes(version.slice(1)) &&
          v.id === version.slice(1)),
    );

    if (!versionEntry) {
      return sendError("Not Found", "Minecraft version not found", 404);
    }

    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const nowTimestamp = +now;

    const before = new Date(dateFixes[version] ?? versionEntry.releaseTime);
    before.setHours(0, 0, 0, 0);
    const beforeTimestamp = +before;

    const diff = nowTimestamp - beforeTimestamp;

    const shortTime = humanize(diff, {
      units: ["y", "mo", "w", "d"],
      maxDecimalPoints: 0,
      language: "en",
      largest: 2,
    });

    const daysSinceStr = humanize(diff, {
      maxDecimalPoints: 0,
      language: "en",
      units: ["d"],
    });

    const name = `Minecraft${getTypePrefix(versionEntry.type)} ${versionEntry.id}`;
    const isToday = nowTimestamp === beforeTimestamp;

    const howold = isToday
      ? `🎉 ${name} released today! 🎉`
      : `${name} is ${humanize(diff, {
          units: ["y", "mo", "w", "d"],
          maxDecimalPoints: 0,
          language: "en",
          largest: 3,
        })} old today.`;

    const shortHowOld = isToday
      ? `${name} released today!`
      : `${name} is ${shortTime} old.`;
    const title = `How old is ${name} today?`;

    const daysSince = parseInt(daysSinceStr.split(" ")[0]);

    return new Response(
      `<html>
  <head>
    <title>${title}</title>
    <meta name="theme-color" content="#018944">
    <meta property="og:title" content="${title}">
    <meta property="og:site_name" content="howoldisminecraft.today/${versionEntry.id}">
  
    <meta property="description" content="${shortHowOld}">
    <meta property="og:description" content="${shortHowOld}">
    <meta property="twitter:description" content="${shortHowOld}">
  
    <meta name="twitter:card" content="summary_large_image">
    <meta property="twitter:title" content="${title}">
    <meta property="twitter:site" content="Created by gaminggeek.dev">
    <style>
        #thestuff {
            text-align: center;
            position: relative; transform: translateY(43vh);
        }
        #howold {
            margin: 0; font-size: ${howold.length >= 55 ? "3" : "3.5"}vw;
        }
        #days {
            margin: 0; font-size: 2vw;
        }
        @media (prefers-color-scheme: dark) {
            body {
                background-color: black;
                color: white;
            }
        }
        @media (max-width: 600px) {
            #howold { font-size: 8vw; }
            #days { font-size: 5vw; }
        }
    </style>
  </head>
  <body>
    <div id="thestuff">
      <h1 id="howold">${howold}</h1>
    ${daysSince >= 30 ? `<h2 id="days">(That's ${daysSinceStr}!)</h2>` : ""}
    </div>
  </body>
</html>`,
      {
        headers: { "Content-Type": "text/html; charset=utf-8" },
      },
    );
  },
};
