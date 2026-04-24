import * as core from '@actions/core';
import * as github from '@actions/github';

export class Input {
    public static Github = class {
        public static get TOKEN(): string {
            const token = process.env.GITHUB_TOKEN;
            if (!token) {
                throw new Error("No GITHUB_TOKEN found. Pass `GITHUB_TOKEN` as env!");
            }
            return token;
        }

        public static get REPO(): { owner: string; repo: string } {
            const repo = core.getInput("repo");
            if (repo === "") {
                return github.context.repo;
            }
            const [owner, repoName] = repo.split("/");
            return { owner, repo: repoName };
        }
    };

    public static Release = class {
        public static get DROP(): boolean {
            return core.getBooleanInput("release-drop");
        }

        public static get KEEP_COUNT(): number {
            return Math.max(Number(core.getInput("release-keep-count")), -1);
        }

        public static get DROP_TAG(): boolean {
            return core.getBooleanInput("release-drop-tag");
        }
    };

    public static PreRelease = class {
        public static get DROP(): boolean {
            return core.getBooleanInput("pre-release-drop");
        }

        public static get KEEP_COUNT(): number {
            return Math.max(Number(core.getInput("pre-release-keep-count")), -1);
        }

        public static get DROP_TAG(): boolean {
            return core.getBooleanInput("pre-release-drop-tag");
        }
    };

    public static Draft = class {
        public static get DROP(): boolean {
            return core.getBooleanInput("draft-drop");
        }

        public static get KEEP_COUNT(): number {
            return Math.max(Number(core.getInput("draft-drop-count")), -1);
        }
    };
}
