/base44tf/repotf/ contains the scripts to transform the sourced website repository code for suitable deployment using cloudflare pages.
infra/cfpages/ should contain the code that provisions the cloudflare pages project and assigns the target url

Currently, there is no separation of concerns between the execution code which transforms the given website code and the resulting code which we want to deploy.
Furthermore, the infra/ terraform scripts are also highly entangled with the specific website code.

example1:
| `../base44sites/delibros` -> | `/base44tf/repotf/<scripts.js, scripts.sh>` | -> | `../sites/delibros/` | <- |`/infra/cfpages/<scripts.tf>`| -> | https://delibros.pages.dev |

example2:
| `../base44sites/paulplumber` -> | `/base44tf/repotf/<scripts.js, scripts.sh>` | -> | `../sites/paulplumber/` | <- |`/infra/cfpages/<scripts.tf>`|  -> | https://paulplumber.pages.dev |

You **should not** hardcode paths like `/brickStreetDeli/` 
You **should** use variables passed at runtime

Variables:
- PROJECT_NAME:
  - example: `brickstreetdeli` from `../base44sites/brickstreetdeli`
  - used for new directory name:
    - example: `../sites/brickstreetdeli`
- TARGET_URL:
  - used for Cloudflare URL:
  - example: `https://<specific site here>.pages.dev`
- SOURCE_PATH:
  - The absolute path to the raw, cloned site code:
    - `../base44sites/<specific site here>`
- OUTPUT_BASE:
  - The absolute directory path where all transformed sites live:
	- `/Users/wm/Code/GRITBOX_GH/autosao/sites/`

The updated/refactored base44tf/repotf/ scripts should make a new directory
- Create a unique `WORKING_DIR` at `${OUTPUT_BASE}/${PROJECT_NAME}`.
- Refactor all scripts to use the `WORK_DIR` environment variable instead of hardcoded strings

refactor the scripts and disentangle the terraform code.

You can drive agent tasks from CLI with `oz agent run`. 
- Delegate tasks - agents help reduce the sprawl of large context windows.