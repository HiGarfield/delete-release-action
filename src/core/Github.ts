import * as github from '@actions/github';
import * as core from '@actions/core';
import { Endpoints } from "@octokit/types";
import { Input } from "./Input";

type Release = Endpoints["GET /repos/{owner}/{repo}/releases"]["response"]["data"][number];

export class Github {
    private readonly octokit: ReturnType<typeof github.getOctokit>;

    private constructor() {
        this.octokit = github.getOctokit(Input.Github.TOKEN);
    }

    public async listReleases(): Promise<Release[]> {
        return this.octokit.paginate(
            "GET /repos/{owner}/{repo}/releases",
            Input.Github.REPO,
        );
    }

    public async dropRelease(release: Release, dropTag: boolean): Promise<void> {
        for (const asset of release.assets) {
            await this.octokit.rest.repos.deleteReleaseAsset({
                ...Input.Github.REPO,
                asset_id: asset.id,
            });
            core.debug(`Release asset dropped: [${release.name}] ${asset.name}`);
        }
        core.debug(`Drop release: ${release.name}`);
        await this.octokit.rest.repos.deleteRelease({
            ...Input.Github.REPO,
            release_id: release.id,
        });
        if (dropTag) {
            core.debug(`Drop tag: ${release.tag_name}`);
            await this.octokit.rest.git.deleteRef({
                ...Input.Github.REPO,
                ref: `tags/${release.tag_name}`,
            });
        }
        core.info(`Release dropped: ${release.name ?? release.tag_name}`);
    }

    private static instance: Github | null = null;

    public static getInstance(): Github {
        if (this.instance === null) {
            this.instance = new Github();
        }
        return this.instance;
    }
}
