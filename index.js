const core = require("@actions/core");
const github = require("@actions/github");
const utils = require("./utils");
const actions = require("./actions");

async function run() {
  try {
    const config = utils.getConfig();
    const octokit = github.getOctokit(config.token, {
      log: {
        debug: (message) => core.info(message),
        info: (message) => core.info(message),
        error: (message) => core.info(message),
        warn: (message) => core.info(message),
      }
    });
    // octokit.rest.packages.deletePackageForOrg({
    //   package_type: "container",
    //   package_name: 'maven-content-scanner',
    //   org: 'lookio',
    //   package_version_id: '57835353',
    // });

    if (config.tag) {
      await actions.deleteByTag(config, octokit);
    } else if (config.untaggedKeepLatest) {
      await actions.deleteUntaggedOrderGreaterThan(config, octokit);
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
