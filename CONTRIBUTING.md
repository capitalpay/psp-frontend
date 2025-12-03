# Contributing to PSP Frontend

Thank you for your interest in contributing to the PSP Frontend!

## Development Workflow

1. **Fork and Clone**
   ```bash
   git clone https://github.com/capitalpay/psp-frontend.git
   cd psp-frontend
   ```

2. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make Changes**
   - Write clean, maintainable code
   - Follow the established code style
   - Add tests for new features
   - Update documentation as needed

4. **Test Your Changes**
   ```bash
   npm run lint
   npm run format
   npm test
   npm run build
   ```

5. **Commit Changes**
   - Use clear, descriptive commit messages
   - Follow conventional commits format:
     - `feat:` - New feature
     - `fix:` - Bug fix
     - `docs:` - Documentation changes
     - `style:` - Code style changes
     - `refactor:` - Code refactoring
     - `test:` - Test additions/changes
     - `chore:` - Build/tooling changes

6. **Push and Create PR**
   ```bash
   git push origin feature/your-feature-name
   ```
   - Open a pull request on GitHub
   - Provide a clear description of changes
   - Link related issues

## Code Style

- Use TypeScript for type safety
- Follow ESLint and Prettier configurations
- Write meaningful variable and function names
- Add JSDoc comments for complex functions
- Keep components small and focused

## Testing

- Write unit tests for utilities and hooks
- Write component tests for UI components
- Ensure all tests pass before submitting PR

## Questions?

Feel free to open an issue for any questions or concerns.
