# Versioning Strategy

## Why 1.0.0 and not 1.2.5?

### Decision
**@lexia/sdk** starts at version **1.0.0** for its first npm release.

### Reasoning

1. **First Release**: This is the first time the package is published to npm
   - Following semantic versioning best practices
   - Starting at 1.0.0 indicates production-ready, stable first release

2. **Independent Package**: While based on the Python `lexia` package:
   - Different language (JavaScript vs Python)
   - Different ecosystem (npm vs PyPI)
   - Different package name (`@lexia/sdk` vs `lexia`)
   - Should have independent versioning

3. **Python Package Context**: 
   - The Python `lexia` package is at version 1.2.5
   - That version reflects its own history and iterations
   - The npm package doesn't need to inherit that version history

4. **Semantic Versioning**:
   - **1.0.0** = First stable, production-ready release
   - Clearly communicates: "This is our first official release"
   - Future updates will follow semver: 1.1.0, 1.2.0, 2.0.0, etc.

### Version Compatibility

| Package | Version | Status |
|---------|---------|--------|
| Python: `lexia` | 1.2.5 | Multiple releases, evolved over time |
| JavaScript: `@lexia/sdk` | 1.0.0 | First release, production-ready |
| **Feature Parity** | ✅ 100% | Both have identical functionality |

### Future Versioning

The npm package will version independently:

- **1.x.x** - Maintain feature parity with Python package
- **2.0.0** - If breaking API changes are introduced
- **1.1.0** - If new features are added
- **1.0.x** - For bug fixes and patches

### Communication to Users

In documentation, we clarify:
- ✅ "First release of @lexia/sdk"
- ✅ "Version 1.0.0 - production ready"
- ✅ "Feature parity with lexia (Python) v1.2.5"
- ✅ Version numbers differ due to independent release cycles

### Conclusion

Starting at **1.0.0** is the correct choice because:
1. It's honest (first npm release)
2. It follows semantic versioning standards
3. It avoids confusion about the package's history
4. It clearly communicates production readiness
5. It allows independent evolution of the npm package

---

**Decision Date:** October 12, 2024  
**Status:** ✅ Implemented (all files updated to v1.0.0)




