# Release

Cut a new release of Lettuce.

## Steps

1. **Check the working tree is clean** — run `git status`. If there are uncommitted changes, stop and tell the user.

2. **Determine the next version** — run `git tag --sort=-v:refname | head -5` to see existing tags. Ask the user what the new version should be (e.g. `v1.0.0`) unless they passed it as an argument (`$ARGUMENTS`).

3. **Update `package.json`** — set `"version"` to the new version number (without the `v` prefix). Use Edit, not Write.

4. **Commit the version bump** — stage `package.json` and commit:
   ```
   chore: bump version to <version>
   ```

5. **Create and push the tag**:
   ```bash
   git tag <version>
   ```
   Then tell the user to run:
   ```
   git push && git push origin <version>
   ```
   Explain that pushing the tag triggers the GitHub Actions release workflow.

6. **Summarise** — tell the user what was done and link to the Actions tab of the repo to monitor the release workflow.
