import { Router } from "express";
import { SharedPath } from "../../sender/shared-folder";
import { basename, join } from "path";
import { getPortValue } from "../../sender/port";
import { routesPrefix } from "../routes-prefix";
import { getPathData } from "../../helpers/file-system/path-data";
import { isDir } from "../../helpers/path-type/is-dir";
import { platform } from "process";

export const GetArch = {
    path: "/get-arch",
    router: Router(),
};

GetArch.router.get("/", (req, res) => {
    (async () => {
        if (SharedPath === undefined) {
            res.send({
                status: "THERE_ARE_NO_SHARED_PATHS",
            });
            return;
        }

        let path =
                new URL(
                    `http://localhost:${await getPortValue()}${join(
                        routesPrefix,
                        GetArch.path,
                        req.url
                    )}`
                ).searchParams.get("path") || "/",
            finalPath = join(SharedPath, path),
            pathStatus = isDir(finalPath),
            pathList = join(basename(SharedPath), path).split(
                platform === "win32" ? `\\` : "/"
            );

        pathList = pathList.filter((folder) => folder !== "");

        if (pathStatus === true) {
            res.send(getPathData(finalPath, pathList));
            return;
        }

        res.send({
            status: "NOTHING_TO_SHOW",
        });
    })();
});
