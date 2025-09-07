#!/usr/bin/env python3
"""
Simple script to help users download all necessary files
for the Executive Meeting Summary Generator
"""

import os
import shutil
import sys

def create_app_structure():
    """Create the application structure in a user-friendly way"""
    
    print("🚀 Executive Meeting Summary Generator - File Setup")
    print("=" * 50)
    
    # Get the desktop path
    desktop = os.path.join(os.path.expanduser("~"), "Desktop")
    app_folder = os.path.join(desktop, "ExecutiveSummaryApp")
    
    print(f"Creating application folder at: {app_folder}")
    
    # Create main folder
    os.makedirs(app_folder, exist_ok=True)
    
    # Create subfolders
    backend_folder = os.path.join(app_folder, "backend")
    frontend_folder = os.path.join(app_folder, "frontend")
    frontend_src = os.path.join(frontend_folder, "src")
    frontend_components = os.path.join(frontend_src, "components")
    frontend_services = os.path.join(frontend_src, "services")
    frontend_public = os.path.join(frontend_folder, "public")
    
    for folder in [backend_folder, frontend_folder, frontend_src, 
                   frontend_components, frontend_services, frontend_public]:
        os.makedirs(folder, exist_ok=True)
    
    print("✅ Folder structure created!")
    print(f"📁 Your app is located at: {app_folder}")
    print("\nNext steps:")
    print("1. Copy all the application files to this folder")
    print("2. Follow the setup guide to configure your API key")
    print("3. Install dependencies and run the app")
    
    return app_folder

if __name__ == "__main__":
    try:
        app_path = create_app_structure()
        print(f"\n🎉 Success! Your app folder is ready at:")
        print(f"   {app_path}")
    except Exception as e:
        print(f"❌ Error: {e}")
        print("Please create the folder manually on your Desktop")