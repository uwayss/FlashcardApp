import os
import datetime
from pathlib import Path
import argparse

def generate_file_dump(project_root, output_file, exclude_dirs=None, exclude_files=None, target_folder=None):
    """Generates a file dump for a given project root, optionally for a specific folder.

    Args:
        project_root: Path object representing the root directory of the project.
        output_file: Path object representing the output file.
        exclude_dirs: Set of directory names to exclude.
        exclude_files: Set of file names to exclude.
        target_folder: Optional folder to dump. If None, dumps the entire project.
    """

    exclude_dirs = {
    # General
    '.git', '__pycache__',
    'node_modules',
    '.expo', # If you use Expo managed workflow build artifacts
    '.yarn', # Yarn PnP directory, often large/cache-like
    'coverage', # Test coverage reports

    # Android/IntelliJ specific
    'build',   # Main build output directory (catches android/build, android/app/build)
    '.gradle', # Gradle cache and wrappers
    '.idea',   # IDE project files
    '.cxx',    # C/C++ build intermediates for NDK

    # iOS/Xcode specific
    'xcuserdata',
    'DerivedData',
    'Pods',    # CocoaPods dependencies
    # 'ios', # Keep this if you want to exclude the whole ios dir like before
    # 'assets', # Keep if needed
    # 'codebase', # Keep if needed
    # '.github', # Keep if needed

    # Fastlane (often contains large reports/screenshots)
    'fastlane',

    # Ruby (often related to CocoaPods/vendor)
    'bundle', # Assuming inside 'vendor/' as per gitignore comment, this will catch it anywhere
    'ios'
}
    # Added common generated/binary/sensitive files found in Android projects
    exclude_files = {
    # Lock files (usually okay to keep, but listed here if you want to match gitignore strictly)
    'package-lock.json',
    'pnpm-lock.yaml',
    'bun.lockb',

    # OS specific
    '.DS_Store',

    # Build/config specific
    'local.properties', # Android SDK path, sensitive/local
    '.xcode.env.local', # Xcode local env

    # Logs
    'npm-debug.log',
    'yarn-error.log',

    # Metro temp file (approximating .metro-health-check*)
    '.metro-health-check', # Check if this exact name appears, otherwise might need prefix check
}
    exclude_extensions = {
    # Android/Java
    '.apk', '.aar', '.jar', # Binaries/archives
    '.keystore', '.jks',   # Keystores (often binary/sensitive)
    '.hprof',              # Heap dumps
    '.iml',                # IntelliJ module files

    # iOS/Xcode
    '.pbxuser', '.mode1v3', '.mode2v3', '.perspectivev3',
    '.xccheckout', '.moved-aside', '.hmap', '.ipa', '.xcuserstate',

    # Bundles
    '.jsbundle',
}
    with open(output_file, 'w', encoding='utf-8') as f_out:
        f_out.write(f'// AUTOGENERATED CODEBASE DUMP\n')
        f_out.write(f'// Project Root: {project_root}\n')
        if target_folder:
            f_out.write(f'// Target Folder: {target_folder}\n\n')
        else:
            f_out.write(f'// Target Folder: All\n\n')



        for root, _, files in os.walk(project_root):
            root_path = Path(root)

            if target_folder:
                target_path = project_root / target_folder
                if not target_path.is_dir():
                    print(f"Error: Target folder '{target_folder}' not found.")
                    return  # Stop execution if target folder doesn't exist

                if not root_path.is_relative_to(target_path): #skip folders that are not in target folder
                    continue

            for file in files:
                file_path = root_path / file

                if any(part in exclude_dirs for part in file_path.parts) or file in exclude_files or file_path.suffix in exclude_extensions:
                    continue

                try:
                    with open(file_path, 'r', encoding='utf-8') as f_in:
                        content = f_in.read()

                    f_out.write(f'\n// FILE: {file_path.relative_to(project_root)}\n')
                    f_out.write(content + '\n')

                except UnicodeDecodeError:
                    f_out.write(f'\n// FILE: {file_path.relative_to(project_root)} (Skipped due to unreadable content)\n')
                except Exception as e:
                    f_out.write(f'\n// ERROR READING {file_path.relative_to(project_root)}: {str(e)}\n')

    print(f"File dump created: {output_file.resolve()}")


def main():
    parser = argparse.ArgumentParser(description="Generate a codebase dump.")
    parser.add_argument("target_folder", nargs="?", help="Optional target folder to dump (e.g., 'helpers', 'components').")
    args = parser.parse_args()

    project_root = Path(os.getcwd())
    desktop_dir = Path(os.path.expanduser("~/Desktop"))
    parent_folder_name = project_root.name
    timestamp = datetime.datetime.now().strftime("%H%M") #shorter time
    output_filename = f"{parent_folder_name}_{timestamp}.txt"
    output_file = desktop_dir / output_filename

    generate_file_dump(project_root, output_file, target_folder=args.target_folder)


if __name__ == "__main__":
    main()