## Spinup fails pushing develop branch

**Symptom:** You see this error during spinup:

```
error: src refspec develop does not match any
error: failed to push some refs
```

**Why it happens:** GitHub needed a moment to copy the template
files into the new repo. The script tried to create the develop
branch before the files were there.

**How to fix it:**

```bash
cd [your-project-name]
git pull origin main
git checkout -b develop
git push origin develop
```

Then re-run the spinup script — it will detect the repo already
exists and continue from where it left off. Or continue manually
by following the remaining steps in operations/automation/README.md
