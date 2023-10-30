import { Router } from "express";
import { routesPrefix } from "../routes-prefix";
import { getPortValue } from "../../sender/port";
import { join } from "path";
import { sharedPath } from "../../sender/shared-folder";
import { isFile } from "../../helpers/path-type/is-file";

export const DownloadFiles = {
    path: "/download",
    router: Router(),
};

DownloadFiles.router.get("/file", (req, res) => {
    (async () => {
        if (sharedPath === undefined) {
            res.send({
                status: "THERE_ARE_NO_SHARED_PATHS",
            });
            return;
        }

        let path = new URL(
            `http://localhost:${await getPortValue()}${join(
                routesPrefix,
                DownloadFiles.path,
                req.url
            )}`
        ).searchParams.get("path");

        if (!path) {
            res.send({
                status: "FILE_NOT_PROVIDED",
            });
            return;
        }

        let finalPath = join(sharedPath, path),
            pathStatus = isFile(finalPath);

        if (pathStatus === true) {
            res.download(finalPath);
            return;
        }

        if (pathStatus === false) {
            res.send({
                status: "ONLY_FILES_CAN_BE_DOWNLOADED",
            });
            return;
        }

        res.send({
            status: "PATH_DOES_NOT_EXIST",
        });
    })();
});