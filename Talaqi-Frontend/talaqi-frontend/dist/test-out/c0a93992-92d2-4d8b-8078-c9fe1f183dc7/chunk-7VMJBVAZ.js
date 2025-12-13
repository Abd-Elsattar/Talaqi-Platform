import {
  HttpClient,
  init_http
} from "./chunk-5MEUGRN6.js";
import {
  getDOM,
  init_common
} from "./chunk-O2B34YRL.js";
import {
  ApplicationRef,
  ChangeDetectorRef,
  DestroyRef,
  Directive,
  ElementRef,
  EventEmitter,
  FactoryTarget,
  Host,
  Inject,
  Injectable,
  InjectionToken,
  Injector,
  Input,
  NgModule,
  Optional,
  Output,
  Renderer2,
  RuntimeError,
  Self,
  SkipSelf,
  Subject,
  __decorate,
  afterNextRender,
  booleanAttribute,
  computed,
  core_exports,
  forkJoin,
  forwardRef,
  from,
  init_core,
  init_esm,
  init_operators,
  init_tslib_es6,
  inject,
  isPromise,
  isSubscribable,
  map,
  signal,
  untracked,
  ɵɵngDeclareClassMetadata,
  ɵɵngDeclareDirective,
  ɵɵngDeclareFactory,
  ɵɵngDeclareInjectable,
  ɵɵngDeclareInjector,
  ɵɵngDeclareNgModule
} from "./chunk-3WXPC76P.js";
import {
  __commonJS,
  __esm,
  __spreadProps,
  __spreadValues
} from "./chunk-HBW54YOI.js";

// node_modules/@angular/forms/fesm2022/forms.mjs
function _isAndroid() {
  const userAgent = getDOM() ? getDOM().getUserAgent() : "";
  return /android (\d+)/.test(userAgent.toLowerCase());
}
function isEmptyInputValue(value) {
  return value == null || lengthOrSize(value) === 0;
}
function lengthOrSize(value) {
  if (value == null) {
    return null;
  } else if (Array.isArray(value) || typeof value === "string") {
    return value.length;
  } else if (value instanceof Set) {
    return value.size;
  }
  return null;
}
function minValidator(min) {
  return (control) => {
    if (control.value == null || min == null) {
      return null;
    }
    const value = parseFloat(control.value);
    return !isNaN(value) && value < min ? { "min": { "min": min, "actual": control.value } } : null;
  };
}
function maxValidator(max) {
  return (control) => {
    if (control.value == null || max == null) {
      return null;
    }
    const value = parseFloat(control.value);
    return !isNaN(value) && value > max ? { "max": { "max": max, "actual": control.value } } : null;
  };
}
function requiredValidator(control) {
  return isEmptyInputValue(control.value) ? { "required": true } : null;
}
function requiredTrueValidator(control) {
  return control.value === true ? null : { "required": true };
}
function emailValidator(control) {
  if (isEmptyInputValue(control.value)) {
    return null;
  }
  return EMAIL_REGEXP.test(control.value) ? null : { "email": true };
}
function minLengthValidator(minLength) {
  return (control) => {
    const length = control.value?.length ?? lengthOrSize(control.value);
    if (length === null || length === 0) {
      return null;
    }
    return length < minLength ? { "minlength": { "requiredLength": minLength, "actualLength": length } } : null;
  };
}
function maxLengthValidator(maxLength) {
  return (control) => {
    const length = control.value?.length ?? lengthOrSize(control.value);
    if (length !== null && length > maxLength) {
      return { "maxlength": { "requiredLength": maxLength, "actualLength": length } };
    }
    return null;
  };
}
function patternValidator(pattern) {
  if (!pattern)
    return nullValidator;
  let regex;
  let regexStr;
  if (typeof pattern === "string") {
    regexStr = "";
    if (pattern.charAt(0) !== "^")
      regexStr += "^";
    regexStr += pattern;
    if (pattern.charAt(pattern.length - 1) !== "$")
      regexStr += "$";
    regex = new RegExp(regexStr);
  } else {
    regexStr = pattern.toString();
    regex = pattern;
  }
  return (control) => {
    if (isEmptyInputValue(control.value)) {
      return null;
    }
    const value = control.value;
    return regex.test(value) ? null : { "pattern": { "requiredPattern": regexStr, "actualValue": value } };
  };
}
function nullValidator(control) {
  return null;
}
function isPresent(o) {
  return o != null;
}
function toObservable(value) {
  const obs = isPromise(value) ? from(value) : value;
  if ((typeof ngDevMode === "undefined" || ngDevMode) && !isSubscribable(obs)) {
    let errorMessage = `Expected async validator to return Promise or Observable.`;
    if (typeof value === "object") {
      errorMessage += " Are you using a synchronous validator where an async validator is expected?";
    }
    throw new RuntimeError(-1101, errorMessage);
  }
  return obs;
}
function mergeErrors(arrayOfErrors) {
  let res = {};
  arrayOfErrors.forEach((errors) => {
    res = errors != null ? __spreadValues(__spreadValues({}, res), errors) : res;
  });
  return Object.keys(res).length === 0 ? null : res;
}
function executeValidators(control, validators) {
  return validators.map((validator) => validator(control));
}
function isValidatorFn(validator) {
  return !validator.validate;
}
function normalizeValidators(validators) {
  return validators.map((validator) => {
    return isValidatorFn(validator) ? validator : ((c) => validator.validate(c));
  });
}
function compose(validators) {
  if (!validators)
    return null;
  const presentValidators = validators.filter(isPresent);
  if (presentValidators.length == 0)
    return null;
  return function(control) {
    return mergeErrors(executeValidators(control, presentValidators));
  };
}
function composeValidators(validators) {
  return validators != null ? compose(normalizeValidators(validators)) : null;
}
function composeAsync(validators) {
  if (!validators)
    return null;
  const presentValidators = validators.filter(isPresent);
  if (presentValidators.length == 0)
    return null;
  return function(control) {
    const observables = executeValidators(control, presentValidators).map(toObservable);
    return forkJoin(observables).pipe(map(mergeErrors));
  };
}
function composeAsyncValidators(validators) {
  return validators != null ? composeAsync(normalizeValidators(validators)) : null;
}
function mergeValidators(controlValidators, dirValidator) {
  if (controlValidators === null)
    return [dirValidator];
  return Array.isArray(controlValidators) ? [...controlValidators, dirValidator] : [controlValidators, dirValidator];
}
function getControlValidators(control) {
  return control._rawValidators;
}
function getControlAsyncValidators(control) {
  return control._rawAsyncValidators;
}
function makeValidatorsArray(validators) {
  if (!validators)
    return [];
  return Array.isArray(validators) ? validators : [validators];
}
function hasValidator(validators, validator) {
  return Array.isArray(validators) ? validators.includes(validator) : validators === validator;
}
function addValidators(validators, currentValidators) {
  const current = makeValidatorsArray(currentValidators);
  const validatorsToAdd = makeValidatorsArray(validators);
  validatorsToAdd.forEach((v) => {
    if (!hasValidator(current, v)) {
      current.push(v);
    }
  });
  return current;
}
function removeValidators(validators, currentValidators) {
  return makeValidatorsArray(currentValidators).filter((v) => !hasValidator(validators, v));
}
function controlParentException(nameOrIndex) {
  return new RuntimeError(1050, `formControlName must be used with a parent formGroup directive. You'll want to add a formGroup
      directive and pass it an existing FormGroup instance (you can create one in your class).

      ${describeFormControl(nameOrIndex)}

    Example:

    ${formControlNameExample}`);
}
function describeFormControl(nameOrIndex) {
  if (nameOrIndex == null || nameOrIndex === "") {
    return "";
  }
  const valueType = typeof nameOrIndex === "string" ? "name" : "index";
  return `Affected Form Control ${valueType}: "${nameOrIndex}"`;
}
function ngModelGroupException() {
  return new RuntimeError(1051, `formControlName cannot be used with an ngModelGroup parent. It is only compatible with parents
      that also have a "form" prefix: formGroupName, formArrayName, or formGroup.

      Option 1:  Update the parent to be formGroupName (reactive form strategy)

      ${formGroupNameExample}

      Option 2: Use ngModel instead of formControlName (template-driven strategy)

      ${ngModelGroupExample}`);
}
function missingFormException() {
  return new RuntimeError(1052, `formGroup expects a FormGroup instance. Please pass one in.

      Example:

      ${formControlNameExample}`);
}
function groupParentException() {
  return new RuntimeError(1053, `formGroupName must be used with a parent formGroup directive.  You'll want to add a formGroup
    directive and pass it an existing FormGroup instance (you can create one in your class).

    Example:

    ${formGroupNameExample}`);
}
function arrayParentException() {
  return new RuntimeError(1054, `formArrayName must be used with a parent formGroup directive.  You'll want to add a formGroup
      directive and pass it an existing FormGroup instance (you can create one in your class).

      Example:

      ${formArrayNameExample}`);
}
function ngModelWarning(directiveName) {
  return `
  It looks like you're using ngModel on the same form field as ${directiveName}.
  Support for using the ngModel input property and ngModelChange event with
  reactive form directives has been deprecated in Angular v6 and will be removed
  in a future version of Angular.

  For more information on this, see our API docs here:
  https://angular.io/api/forms/${directiveName === "formControl" ? "FormControlDirective" : "FormControlName"}#use-with-ngmodel
  `;
}
function describeKey(isFormGroup, key) {
  return isFormGroup ? `with name: '${key}'` : `at index: ${key}`;
}
function noControlsError(isFormGroup) {
  return `
    There are no form controls registered with this ${isFormGroup ? "group" : "array"} yet. If you're using ngModel,
    you may want to check next tick (e.g. use setTimeout).
  `;
}
function missingControlError(isFormGroup, key) {
  return `Cannot find form control ${describeKey(isFormGroup, key)}`;
}
function missingControlValueError(isFormGroup, key) {
  return `Must supply a value for form control ${describeKey(isFormGroup, key)}`;
}
function pickValidators(validatorOrOpts) {
  return (isOptionsObj(validatorOrOpts) ? validatorOrOpts.validators : validatorOrOpts) || null;
}
function coerceToValidator(validator) {
  return Array.isArray(validator) ? composeValidators(validator) : validator || null;
}
function pickAsyncValidators(asyncValidator, validatorOrOpts) {
  if (typeof ngDevMode === "undefined" || ngDevMode) {
    if (isOptionsObj(validatorOrOpts) && asyncValidator) {
      console.warn(asyncValidatorsDroppedWithOptsWarning);
    }
  }
  return (isOptionsObj(validatorOrOpts) ? validatorOrOpts.asyncValidators : asyncValidator) || null;
}
function coerceToAsyncValidator(asyncValidator) {
  return Array.isArray(asyncValidator) ? composeAsyncValidators(asyncValidator) : asyncValidator || null;
}
function isOptionsObj(validatorOrOpts) {
  return validatorOrOpts != null && !Array.isArray(validatorOrOpts) && typeof validatorOrOpts === "object";
}
function assertControlPresent(parent, isGroup, key) {
  const controls = parent.controls;
  const collection = isGroup ? Object.keys(controls) : controls;
  if (!collection.length) {
    throw new RuntimeError(1e3, typeof ngDevMode === "undefined" || ngDevMode ? noControlsError(isGroup) : "");
  }
  if (!controls[key]) {
    throw new RuntimeError(1001, typeof ngDevMode === "undefined" || ngDevMode ? missingControlError(isGroup, key) : "");
  }
}
function assertAllValuesPresent(control, isGroup, value) {
  control._forEachChild((_, key) => {
    if (value[key] === void 0) {
      throw new RuntimeError(1002, typeof ngDevMode === "undefined" || ngDevMode ? missingControlValueError(isGroup, key) : "");
    }
  });
}
function validateFormGroupControls(controls) {
  const invalidKeys = Object.keys(controls).filter((key) => key.includes("."));
  if (invalidKeys.length > 0) {
    console.warn(`FormGroup keys cannot include \`.\`, please replace the keys for: ${invalidKeys.join(",")}.`);
  }
}
function controlPath(name, parent) {
  return [...parent.path, name];
}
function setUpControl(control, dir, callSetDisabledState = setDisabledStateDefault) {
  if (typeof ngDevMode === "undefined" || ngDevMode) {
    if (!control)
      _throwError(dir, "Cannot find control with");
    if (!dir.valueAccessor)
      _throwMissingValueAccessorError(dir);
  }
  setUpValidators(control, dir);
  dir.valueAccessor.writeValue(control.value);
  if (control.disabled || callSetDisabledState === "always") {
    dir.valueAccessor.setDisabledState?.(control.disabled);
  }
  setUpViewChangePipeline(control, dir);
  setUpModelChangePipeline(control, dir);
  setUpBlurPipeline(control, dir);
  setUpDisabledChangeHandler(control, dir);
}
function cleanUpControl(control, dir, validateControlPresenceOnChange = true) {
  const noop = () => {
    if (validateControlPresenceOnChange && (typeof ngDevMode === "undefined" || ngDevMode)) {
      _noControlError(dir);
    }
  };
  if (dir.valueAccessor) {
    dir.valueAccessor.registerOnChange(noop);
    dir.valueAccessor.registerOnTouched(noop);
  }
  cleanUpValidators(control, dir);
  if (control) {
    dir._invokeOnDestroyCallbacks();
    control._registerOnCollectionChange(() => {
    });
  }
}
function registerOnValidatorChange(validators, onChange) {
  validators.forEach((validator) => {
    if (validator.registerOnValidatorChange)
      validator.registerOnValidatorChange(onChange);
  });
}
function setUpDisabledChangeHandler(control, dir) {
  if (dir.valueAccessor.setDisabledState) {
    const onDisabledChange = (isDisabled) => {
      dir.valueAccessor.setDisabledState(isDisabled);
    };
    control.registerOnDisabledChange(onDisabledChange);
    dir._registerOnDestroy(() => {
      control._unregisterOnDisabledChange(onDisabledChange);
    });
  }
}
function setUpValidators(control, dir) {
  const validators = getControlValidators(control);
  if (dir.validator !== null) {
    control.setValidators(mergeValidators(validators, dir.validator));
  } else if (typeof validators === "function") {
    control.setValidators([validators]);
  }
  const asyncValidators = getControlAsyncValidators(control);
  if (dir.asyncValidator !== null) {
    control.setAsyncValidators(mergeValidators(asyncValidators, dir.asyncValidator));
  } else if (typeof asyncValidators === "function") {
    control.setAsyncValidators([asyncValidators]);
  }
  const onValidatorChange = () => control.updateValueAndValidity();
  registerOnValidatorChange(dir._rawValidators, onValidatorChange);
  registerOnValidatorChange(dir._rawAsyncValidators, onValidatorChange);
}
function cleanUpValidators(control, dir) {
  let isControlUpdated = false;
  if (control !== null) {
    if (dir.validator !== null) {
      const validators = getControlValidators(control);
      if (Array.isArray(validators) && validators.length > 0) {
        const updatedValidators = validators.filter((validator) => validator !== dir.validator);
        if (updatedValidators.length !== validators.length) {
          isControlUpdated = true;
          control.setValidators(updatedValidators);
        }
      }
    }
    if (dir.asyncValidator !== null) {
      const asyncValidators = getControlAsyncValidators(control);
      if (Array.isArray(asyncValidators) && asyncValidators.length > 0) {
        const updatedAsyncValidators = asyncValidators.filter((asyncValidator) => asyncValidator !== dir.asyncValidator);
        if (updatedAsyncValidators.length !== asyncValidators.length) {
          isControlUpdated = true;
          control.setAsyncValidators(updatedAsyncValidators);
        }
      }
    }
  }
  const noop = () => {
  };
  registerOnValidatorChange(dir._rawValidators, noop);
  registerOnValidatorChange(dir._rawAsyncValidators, noop);
  return isControlUpdated;
}
function setUpViewChangePipeline(control, dir) {
  dir.valueAccessor.registerOnChange((newValue) => {
    control._pendingValue = newValue;
    control._pendingChange = true;
    control._pendingDirty = true;
    if (control.updateOn === "change")
      updateControl(control, dir);
  });
}
function setUpBlurPipeline(control, dir) {
  dir.valueAccessor.registerOnTouched(() => {
    control._pendingTouched = true;
    if (control.updateOn === "blur" && control._pendingChange)
      updateControl(control, dir);
    if (control.updateOn !== "submit")
      control.markAsTouched();
  });
}
function updateControl(control, dir) {
  if (control._pendingDirty)
    control.markAsDirty();
  control.setValue(control._pendingValue, { emitModelToViewChange: false });
  dir.viewToModelUpdate(control._pendingValue);
  control._pendingChange = false;
}
function setUpModelChangePipeline(control, dir) {
  const onChange = (newValue, emitModelEvent) => {
    dir.valueAccessor.writeValue(newValue);
    if (emitModelEvent)
      dir.viewToModelUpdate(newValue);
  };
  control.registerOnChange(onChange);
  dir._registerOnDestroy(() => {
    control._unregisterOnChange(onChange);
  });
}
function setUpFormContainer(control, dir) {
  if (control == null && (typeof ngDevMode === "undefined" || ngDevMode))
    _throwError(dir, "Cannot find control with");
  setUpValidators(control, dir);
}
function cleanUpFormContainer(control, dir) {
  return cleanUpValidators(control, dir);
}
function _noControlError(dir) {
  return _throwError(dir, "There is no FormControl instance attached to form control element with");
}
function _throwError(dir, message) {
  const messageEnd = _describeControlLocation(dir);
  throw new Error(`${message} ${messageEnd}`);
}
function _describeControlLocation(dir) {
  const path = dir.path;
  if (path && path.length > 1)
    return `path: '${path.join(" -> ")}'`;
  if (path?.[0])
    return `name: '${path}'`;
  return "unspecified name attribute";
}
function _throwMissingValueAccessorError(dir) {
  const loc = _describeControlLocation(dir);
  throw new RuntimeError(-1203, `No value accessor for form control ${loc}.`);
}
function _throwInvalidValueAccessorError(dir) {
  const loc = _describeControlLocation(dir);
  throw new RuntimeError(1200, `Value accessor was not provided as an array for form control with ${loc}. Check that the \`NG_VALUE_ACCESSOR\` token is configured as a \`multi: true\` provider.`);
}
function isPropertyUpdated(changes, viewModel) {
  if (!changes.hasOwnProperty("model"))
    return false;
  const change = changes["model"];
  if (change.isFirstChange())
    return true;
  return !Object.is(viewModel, change.currentValue);
}
function isBuiltInAccessor(valueAccessor) {
  return Object.getPrototypeOf(valueAccessor.constructor) === BuiltInControlValueAccessor;
}
function syncPendingControls(form, directives) {
  form._syncPendingControls();
  directives.forEach((dir) => {
    const control = dir.control;
    if (control.updateOn === "submit" && control._pendingChange) {
      dir.viewToModelUpdate(control._pendingValue);
      control._pendingChange = false;
    }
  });
}
function selectValueAccessor(dir, valueAccessors) {
  if (!valueAccessors)
    return null;
  if (!Array.isArray(valueAccessors) && (typeof ngDevMode === "undefined" || ngDevMode))
    _throwInvalidValueAccessorError(dir);
  let defaultAccessor = void 0;
  let builtinAccessor = void 0;
  let customAccessor = void 0;
  valueAccessors.forEach((v) => {
    if (v.constructor === DefaultValueAccessor) {
      defaultAccessor = v;
    } else if (isBuiltInAccessor(v)) {
      if (builtinAccessor && (typeof ngDevMode === "undefined" || ngDevMode))
        _throwError(dir, "More than one built-in value accessor matches form control with");
      builtinAccessor = v;
    } else {
      if (customAccessor && (typeof ngDevMode === "undefined" || ngDevMode))
        _throwError(dir, "More than one custom value accessor matches form control with");
      customAccessor = v;
    }
  });
  if (customAccessor)
    return customAccessor;
  if (builtinAccessor)
    return builtinAccessor;
  if (defaultAccessor)
    return defaultAccessor;
  if (typeof ngDevMode === "undefined" || ngDevMode) {
    _throwError(dir, "No valid value accessor for form control with");
  }
  return null;
}
function removeListItem$1(list, el) {
  const index = list.indexOf(el);
  if (index > -1)
    list.splice(index, 1);
}
function _ngModelWarning(name, type, instance, warningConfig) {
  if (warningConfig === "never")
    return;
  if ((warningConfig === null || warningConfig === "once") && !type._ngModelWarningSentOnce || warningConfig === "always" && !instance._ngModelWarningSent) {
    console.warn(ngModelWarning(name));
    type._ngModelWarningSentOnce = true;
    instance._ngModelWarningSent = true;
  }
}
function removeListItem(list, el) {
  const index = list.indexOf(el);
  if (index > -1)
    list.splice(index, 1);
}
function isFormControlState(formState) {
  return typeof formState === "object" && formState !== null && Object.keys(formState).length === 2 && "value" in formState && "disabled" in formState;
}
function modelParentException() {
  return new RuntimeError(1350, `
    ngModel cannot be used to register form controls with a parent formGroup directive.  Try using
    formGroup's partner directive "formControlName" instead.  Example:

    ${formControlNameExample}

    Or, if you'd like to avoid registering this form control, indicate that it's standalone in ngModelOptions:

    Example:

    ${ngModelWithFormGroupExample}`);
}
function formGroupNameException() {
  return new RuntimeError(1351, `
    ngModel cannot be used to register form controls with a parent formGroupName or formArrayName directive.

    Option 1: Use formControlName instead of ngModel (reactive strategy):

    ${formGroupNameExample}

    Option 2:  Update ngModel's parent be ngModelGroup (template-driven strategy):

    ${ngModelGroupExample}`);
}
function missingNameException() {
  return new RuntimeError(1352, `If ngModel is used within a form tag, either the name attribute must be set or the form
    control must be defined as 'standalone' in ngModelOptions.

    Example 1: <input [(ngModel)]="person.firstName" name="first">
    Example 2: <input [(ngModel)]="person.firstName" [ngModelOptions]="{standalone: true}">`);
}
function modelGroupParentException() {
  return new RuntimeError(1353, `
    ngModelGroup cannot be used with a parent formGroup directive.

    Option 1: Use formGroupName instead of ngModelGroup (reactive strategy):

    ${formGroupNameExample}

    Option 2:  Use a regular form tag instead of the formGroup directive (template-driven strategy):

    ${ngModelGroupExample}`);
}
function checkParentType$1(parent) {
  if (!(parent instanceof NgModelGroup) && parent instanceof AbstractFormGroupDirective) {
    throw formGroupNameException();
  } else if (!(parent instanceof NgModelGroup) && !(parent instanceof NgForm)) {
    throw modelParentException();
  }
}
function throwNameError() {
  throw new RuntimeError(1202, `
      If you define both a name and a formControlName attribute on your radio button, their values
      must match. Ex: <input type="radio" formControlName="food" name="food">
    `);
}
function hasInvalidParent(parent) {
  return !(parent instanceof FormGroupName) && !(parent instanceof FormGroupDirective) && !(parent instanceof FormArrayName);
}
function checkParentType(parent, name) {
  if (!(parent instanceof FormGroupName) && parent instanceof AbstractFormGroupDirective) {
    throw ngModelGroupException();
  } else if (!(parent instanceof FormGroupName) && !(parent instanceof FormGroupDirective) && !(parent instanceof FormArrayName)) {
    throw controlParentException(name);
  }
}
function _buildValueString$1(id, value) {
  if (id == null)
    return `${value}`;
  if (value && typeof value === "object")
    value = "Object";
  return `${id}: ${value}`.slice(0, 50);
}
function _extractId$1(valueString) {
  return valueString.split(":")[0];
}
function _buildValueString(id, value) {
  if (id == null)
    return `${value}`;
  if (typeof value === "string")
    value = `'${value}'`;
  if (value && typeof value === "object")
    value = "Object";
  return `${id}: ${value}`.slice(0, 50);
}
function _extractId(valueString) {
  return valueString.split(":")[0];
}
function toInteger(value) {
  return typeof value === "number" ? value : parseInt(value, 10);
}
function toFloat(value) {
  return typeof value === "number" ? value : parseFloat(value);
}
function isAbstractControlOptions(options) {
  return !!options && (options.asyncValidators !== void 0 || options.validators !== void 0 || options.updateOn !== void 0);
}
var BaseControlValueAccessor, BuiltInControlValueAccessor, NG_VALUE_ACCESSOR, CHECKBOX_VALUE_ACCESSOR, CheckboxControlValueAccessor, DEFAULT_VALUE_ACCESSOR, COMPOSITION_BUFFER_MODE, DefaultValueAccessor, NG_VALIDATORS, NG_ASYNC_VALIDATORS, EMAIL_REGEXP, Validators, AbstractControlDirective, ControlContainer, NgControl, AbstractControlStatus, ngControlStatusHost, ngGroupStatusHost, NgControlStatus, NgControlStatusGroup, formControlNameExample, formGroupNameExample, formArrayNameExample, ngModelGroupExample, ngModelWithFormGroupExample, disabledAttrWarning, asyncValidatorsDroppedWithOptsWarning, VALID, INVALID, PENDING, DISABLED, ControlEvent, ValueChangeEvent, PristineChangeEvent, TouchedChangeEvent, StatusChangeEvent, FormSubmittedEvent, FormResetEvent, AbstractControl, FormGroup, FormRecord, CALL_SET_DISABLED_STATE, setDisabledStateDefault, formDirectiveProvider$1, resolvedPromise$1, NgForm, FormControl, isFormControl, AbstractFormGroupDirective, modelGroupProvider, NgModelGroup, formControlBinding$1, resolvedPromise, NgModel, \u0275NgNoValidate, NUMBER_VALUE_ACCESSOR, NumberValueAccessor, RADIO_VALUE_ACCESSOR, RadioControlRegistry, RadioControlValueAccessor, RANGE_VALUE_ACCESSOR, RangeValueAccessor, NG_MODEL_WITH_FORM_CONTROL_WARNING, formControlBinding, FormControlDirective, formDirectiveProvider, FormGroupDirective, formGroupNameProvider, FormGroupName, formArrayNameProvider, FormArrayName, controlNameBinding, FormControlName, SELECT_VALUE_ACCESSOR, SelectControlValueAccessor, NgSelectOption, SELECT_MULTIPLE_VALUE_ACCESSOR, SelectMultipleControlValueAccessor, \u0275NgSelectMultipleOption, AbstractValidatorDirective, MAX_VALIDATOR, MaxValidator, MIN_VALIDATOR, MinValidator, REQUIRED_VALIDATOR, CHECKBOX_REQUIRED_VALIDATOR, RequiredValidator, CheckboxRequiredValidator, EMAIL_VALIDATOR, EmailValidator, MIN_LENGTH_VALIDATOR, MinLengthValidator, MAX_LENGTH_VALIDATOR, MaxLengthValidator, PATTERN_VALIDATOR, PatternValidator, SHARED_FORM_DIRECTIVES, TEMPLATE_DRIVEN_DIRECTIVES, REACTIVE_DRIVEN_DIRECTIVES, \u0275InternalFormsSharedModule, FormArray, FormBuilder, NonNullableFormBuilder, UntypedFormBuilder, FormsModule, ReactiveFormsModule;
var init_forms = __esm({
  "node_modules/@angular/forms/fesm2022/forms.mjs"() {
    "use strict";
    init_core();
    init_core();
    init_common();
    init_esm();
    init_operators();
    BaseControlValueAccessor = class _BaseControlValueAccessor {
      _renderer;
      _elementRef;
      /**
       * The registered callback function called when a change or input event occurs on the input
       * element.
       * @docs-private
       */
      onChange = (_) => {
      };
      /**
       * The registered callback function called when a blur event occurs on the input element.
       * @docs-private
       */
      onTouched = () => {
      };
      constructor(_renderer, _elementRef) {
        this._renderer = _renderer;
        this._elementRef = _elementRef;
      }
      /**
       * Helper method that sets a property on a target element using the current Renderer
       * implementation.
       * @docs-private
       */
      setProperty(key, value) {
        this._renderer.setProperty(this._elementRef.nativeElement, key, value);
      }
      /**
       * Registers a function called when the control is touched.
       * @docs-private
       */
      registerOnTouched(fn) {
        this.onTouched = fn;
      }
      /**
       * Registers a function called when the control value changes.
       * @docs-private
       */
      registerOnChange(fn) {
        this.onChange = fn;
      }
      /**
       * Sets the "disabled" property on the range input element.
       * @docs-private
       */
      setDisabledState(isDisabled) {
        this.setProperty("disabled", isDisabled);
      }
      static \u0275fac = \u0275\u0275ngDeclareFactory({ minVersion: "12.0.0", version: "20.3.11", ngImport: core_exports, type: _BaseControlValueAccessor, deps: [{ token: Renderer2 }, { token: ElementRef }], target: FactoryTarget.Directive });
      static \u0275dir = \u0275\u0275ngDeclareDirective({ minVersion: "14.0.0", version: "20.3.11", type: _BaseControlValueAccessor, isStandalone: true, ngImport: core_exports });
    };
    \u0275\u0275ngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.3.11", ngImport: core_exports, type: BaseControlValueAccessor, decorators: [{
      type: Directive
    }], ctorParameters: () => [{ type: Renderer2 }, { type: ElementRef }] });
    BuiltInControlValueAccessor = class _BuiltInControlValueAccessor extends BaseControlValueAccessor {
      static \u0275fac = \u0275\u0275ngDeclareFactory({ minVersion: "12.0.0", version: "20.3.11", ngImport: core_exports, type: _BuiltInControlValueAccessor, deps: null, target: FactoryTarget.Directive });
      static \u0275dir = \u0275\u0275ngDeclareDirective({ minVersion: "14.0.0", version: "20.3.11", type: _BuiltInControlValueAccessor, isStandalone: true, usesInheritance: true, ngImport: core_exports });
    };
    \u0275\u0275ngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.3.11", ngImport: core_exports, type: BuiltInControlValueAccessor, decorators: [{
      type: Directive
    }] });
    NG_VALUE_ACCESSOR = new InjectionToken(ngDevMode ? "NgValueAccessor" : "");
    CHECKBOX_VALUE_ACCESSOR = {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxControlValueAccessor),
      multi: true
    };
    CheckboxControlValueAccessor = class _CheckboxControlValueAccessor extends BuiltInControlValueAccessor {
      /**
       * Sets the "checked" property on the input element.
       * @docs-private
       */
      writeValue(value) {
        this.setProperty("checked", value);
      }
      static \u0275fac = \u0275\u0275ngDeclareFactory({ minVersion: "12.0.0", version: "20.3.11", ngImport: core_exports, type: _CheckboxControlValueAccessor, deps: null, target: FactoryTarget.Directive });
      static \u0275dir = \u0275\u0275ngDeclareDirective({ minVersion: "14.0.0", version: "20.3.11", type: _CheckboxControlValueAccessor, isStandalone: false, selector: "input[type=checkbox][formControlName],input[type=checkbox][formControl],input[type=checkbox][ngModel]", host: { listeners: { "change": "onChange($any($event.target).checked)", "blur": "onTouched()" } }, providers: [CHECKBOX_VALUE_ACCESSOR], usesInheritance: true, ngImport: core_exports });
    };
    \u0275\u0275ngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.3.11", ngImport: core_exports, type: CheckboxControlValueAccessor, decorators: [{
      type: Directive,
      args: [{
        selector: "input[type=checkbox][formControlName],input[type=checkbox][formControl],input[type=checkbox][ngModel]",
        host: { "(change)": "onChange($any($event.target).checked)", "(blur)": "onTouched()" },
        providers: [CHECKBOX_VALUE_ACCESSOR],
        standalone: false
      }]
    }] });
    DEFAULT_VALUE_ACCESSOR = {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DefaultValueAccessor),
      multi: true
    };
    COMPOSITION_BUFFER_MODE = new InjectionToken(ngDevMode ? "CompositionEventMode" : "");
    DefaultValueAccessor = class _DefaultValueAccessor extends BaseControlValueAccessor {
      _compositionMode;
      /** Whether the user is creating a composition string (IME events). */
      _composing = false;
      constructor(renderer, elementRef, _compositionMode) {
        super(renderer, elementRef);
        this._compositionMode = _compositionMode;
        if (this._compositionMode == null) {
          this._compositionMode = !_isAndroid();
        }
      }
      /**
       * Sets the "value" property on the input element.
       * @docs-private
       */
      writeValue(value) {
        const normalizedValue = value == null ? "" : value;
        this.setProperty("value", normalizedValue);
      }
      /** @internal */
      _handleInput(value) {
        if (!this._compositionMode || this._compositionMode && !this._composing) {
          this.onChange(value);
        }
      }
      /** @internal */
      _compositionStart() {
        this._composing = true;
      }
      /** @internal */
      _compositionEnd(value) {
        this._composing = false;
        this._compositionMode && this.onChange(value);
      }
      static \u0275fac = \u0275\u0275ngDeclareFactory({ minVersion: "12.0.0", version: "20.3.11", ngImport: core_exports, type: _DefaultValueAccessor, deps: [{ token: Renderer2 }, { token: ElementRef }, { token: COMPOSITION_BUFFER_MODE, optional: true }], target: FactoryTarget.Directive });
      static \u0275dir = \u0275\u0275ngDeclareDirective({ minVersion: "14.0.0", version: "20.3.11", type: _DefaultValueAccessor, isStandalone: false, selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]", host: { listeners: { "input": "_handleInput($any($event.target).value)", "blur": "onTouched()", "compositionstart": "_compositionStart()", "compositionend": "_compositionEnd($any($event.target).value)" } }, providers: [DEFAULT_VALUE_ACCESSOR], usesInheritance: true, ngImport: core_exports });
    };
    \u0275\u0275ngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.3.11", ngImport: core_exports, type: DefaultValueAccessor, decorators: [{
      type: Directive,
      args: [{
        selector: "input:not([type=checkbox])[formControlName],textarea[formControlName],input:not([type=checkbox])[formControl],textarea[formControl],input:not([type=checkbox])[ngModel],textarea[ngModel],[ngDefaultControl]",
        // TODO: vsavkin replace the above selector with the one below it once
        // https://github.com/angular/angular/issues/3011 is implemented
        // selector: '[ngModel],[formControl],[formControlName]',
        host: {
          "(input)": "_handleInput($any($event.target).value)",
          "(blur)": "onTouched()",
          "(compositionstart)": "_compositionStart()",
          "(compositionend)": "_compositionEnd($any($event.target).value)"
        },
        providers: [DEFAULT_VALUE_ACCESSOR],
        standalone: false
      }]
    }], ctorParameters: () => [{ type: Renderer2 }, { type: ElementRef }, { type: void 0, decorators: [{
      type: Optional
    }, {
      type: Inject,
      args: [COMPOSITION_BUFFER_MODE]
    }] }] });
    NG_VALIDATORS = new InjectionToken(ngDevMode ? "NgValidators" : "");
    NG_ASYNC_VALIDATORS = new InjectionToken(ngDevMode ? "NgAsyncValidators" : "");
    EMAIL_REGEXP = /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    Validators = class {
      /**
       * @description
       * Validator that requires the control's value to be greater than or equal to the provided number.
       *
       * @usageNotes
       *
       * ### Validate against a minimum of 3
       *
       * ```ts
       * const control = new FormControl(2, Validators.min(3));
       *
       * console.log(control.errors); // {min: {min: 3, actual: 2}}
       * ```
       *
       * @returns A validator function that returns an error map with the
       * `min` property if the validation check fails, otherwise `null`.
       *
       * @see {@link /api/forms/AbstractControl#updateValueAndValidity updateValueAndValidity}
       *
       */
      static min(min) {
        return minValidator(min);
      }
      /**
       * @description
       * Validator that requires the control's value to be less than or equal to the provided number.
       *
       * @usageNotes
       *
       * ### Validate against a maximum of 15
       *
       * ```ts
       * const control = new FormControl(16, Validators.max(15));
       *
       * console.log(control.errors); // {max: {max: 15, actual: 16}}
       * ```
       *
       * @returns A validator function that returns an error map with the
       * `max` property if the validation check fails, otherwise `null`.
       *
       * @see {@link /api/forms/AbstractControl#updateValueAndValidity updateValueAndValidity}
       *
       */
      static max(max) {
        return maxValidator(max);
      }
      /**
       * @description
       * Validator that requires the control have a non-empty value.
       *
       * @usageNotes
       *
       * ### Validate that the field is non-empty
       *
       * ```ts
       * const control = new FormControl('', Validators.required);
       *
       * console.log(control.errors); // {required: true}
       * ```
       *
       * @returns An error map with the `required` property
       * if the validation check fails, otherwise `null`.
       *
       * @see {@link /api/forms/AbstractControl#updateValueAndValidity updateValueAndValidity}
       *
       */
      static required(control) {
        return requiredValidator(control);
      }
      /**
       * @description
       * Validator that requires the control's value be true. This validator is commonly
       * used for required checkboxes.
       *
       * @usageNotes
       *
       * ### Validate that the field value is true
       *
       * ```ts
       * const control = new FormControl('some value', Validators.requiredTrue);
       *
       * console.log(control.errors); // {required: true}
       * ```
       *
       * @returns An error map that contains the `required` property
       * set to `true` if the validation check fails, otherwise `null`.
       *
       * @see {@link /api/forms/AbstractControl#updateValueAndValidity updateValueAndValidity}
       *
       */
      static requiredTrue(control) {
        return requiredTrueValidator(control);
      }
      /**
       * @description
       * Validator that requires the control's value pass an email validation test.
       *
       * Tests the value using a [regular
       * expression](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions)
       * pattern suitable for common use cases. The pattern is based on the definition of a valid email
       * address in the [WHATWG HTML
       * specification](https://html.spec.whatwg.org/multipage/input.html#valid-e-mail-address) with
       * some enhancements to incorporate more RFC rules (such as rules related to domain names and the
       * lengths of different parts of the address).
       *
       * The differences from the WHATWG version include:
       * - Disallow `local-part` (the part before the `@` symbol) to begin or end with a period (`.`).
       * - Disallow `local-part` to be longer than 64 characters.
       * - Disallow the whole address to be longer than 254 characters.
       *
       * If this pattern does not satisfy your business needs, you can use `Validators.pattern()` to
       * validate the value against a different pattern.
       *
       * @usageNotes
       *
       * ### Validate that the field matches a valid email pattern
       *
       * ```ts
       * const control = new FormControl('bad@', Validators.email);
       *
       * console.log(control.errors); // {email: true}
       * ```
       *
       * @returns An error map with the `email` property
       * if the validation check fails, otherwise `null`.
       *
       * @see {@link /api/forms/AbstractControl#updateValueAndValidity updateValueAndValidity}
       *
       */
      static email(control) {
        return emailValidator(control);
      }
      /**
       * @description
       * Validator that requires the number of items in the control's value to be greater than or equal
       * to the provided minimum length. This validator is also provided by default if you use
       * the HTML5 `minlength` attribute. Note that the `minLength` validator is intended to be used
       * only for types that have a numeric `length` or `size` property, such as strings, arrays or
       * sets. The `minLength` validator logic is also not invoked for values when their `length` or
       * `size` property is 0 (for example in case of an empty string or an empty array), to support
       * optional controls. You can use the standard `required` validator if empty values should not be
       * considered valid.
       *
       * @usageNotes
       *
       * ### Validate that the field has a minimum of 3 characters
       *
       * ```ts
       * const control = new FormControl('ng', Validators.minLength(3));
       *
       * console.log(control.errors); // {minlength: {requiredLength: 3, actualLength: 2}}
       * ```
       *
       * ```html
       * <input minlength="5">
       * ```
       *
       * @returns A validator function that returns an error map with the
       * `minlength` property if the validation check fails, otherwise `null`.
       *
       * @see {@link /api/forms/AbstractControl#updateValueAndValidity updateValueAndValidity}
       *
       */
      static minLength(minLength) {
        return minLengthValidator(minLength);
      }
      /**
       * @description
       * Validator that requires the number of items in the control's value to be less than or equal
       * to the provided maximum length. This validator is also provided by default if you use
       * the HTML5 `maxlength` attribute. Note that the `maxLength` validator is intended to be used
       * only for types that have a numeric `length` or `size` property, such as strings, arrays or
       * sets.
       *
       * @usageNotes
       *
       * ### Validate that the field has maximum of 5 characters
       *
       * ```ts
       * const control = new FormControl('Angular', Validators.maxLength(5));
       *
       * console.log(control.errors); // {maxlength: {requiredLength: 5, actualLength: 7}}
       * ```
       *
       * ```html
       * <input maxlength="5">
       * ```
       *
       * @returns A validator function that returns an error map with the
       * `maxlength` property if the validation check fails, otherwise `null`.
       *
       * @see {@link /api/forms/AbstractControl#updateValueAndValidity updateValueAndValidity}
       *
       */
      static maxLength(maxLength) {
        return maxLengthValidator(maxLength);
      }
      /**
       * @description
       * Validator that requires the control's value to match a regex pattern. This validator is also
       * provided by default if you use the HTML5 `pattern` attribute.
       *
       * @usageNotes
       *
       * ### Validate that the field only contains letters or spaces
       *
       * ```ts
       * const control = new FormControl('1', Validators.pattern('[a-zA-Z ]*'));
       *
       * console.log(control.errors); // {pattern: {requiredPattern: '^[a-zA-Z ]*$', actualValue: '1'}}
       * ```
       *
       * ```html
       * <input pattern="[a-zA-Z ]*">
       * ```
       *
       * ### Pattern matching with the global or sticky flag
       *
       * `RegExp` objects created with the `g` or `y` flags that are passed into `Validators.pattern`
       * can produce different results on the same input when validations are run consecutively. This is
       * due to how the behavior of `RegExp.prototype.test` is
       * specified in [ECMA-262](https://tc39.es/ecma262/#sec-regexpbuiltinexec)
       * (`RegExp` preserves the index of the last match when the global or sticky flag is used).
       * Due to this behavior, it is recommended that when using
       * `Validators.pattern` you **do not** pass in a `RegExp` object with either the global or sticky
       * flag enabled.
       *
       * ```ts
       * // Not recommended (since the `g` flag is used)
       * const controlOne = new FormControl('1', Validators.pattern(/foo/g));
       *
       * // Good
       * const controlTwo = new FormControl('1', Validators.pattern(/foo/));
       * ```
       *
       * @param pattern A regular expression to be used as is to test the values, or a string.
       * If a string is passed, the `^` character is prepended and the `$` character is
       * appended to the provided string (if not already present), and the resulting regular
       * expression is used to test the values.
       *
       * @returns A validator function that returns an error map with the
       * `pattern` property if the validation check fails, otherwise `null`.
       *
       * @see {@link /api/forms/AbstractControl#updateValueAndValidity updateValueAndValidity}
       *
       */
      static pattern(pattern) {
        return patternValidator(pattern);
      }
      /**
       * @description
       * Validator that performs no operation.
       *
       * @see {@link /api/forms/AbstractControl#updateValueAndValidity updateValueAndValidity}
       *
       */
      static nullValidator(control) {
        return nullValidator();
      }
      static compose(validators) {
        return compose(validators);
      }
      /**
       * @description
       * Compose multiple async validators into a single function that returns the union
       * of the individual error objects for the provided control.
       *
       * @returns A validator function that returns an error map with the
       * merged error objects of the async validators if the validation check fails, otherwise `null`.
       *
       * @see {@link /api/forms/AbstractControl#updateValueAndValidity updateValueAndValidity}
       *
       */
      static composeAsync(validators) {
        return composeAsync(validators);
      }
    };
    AbstractControlDirective = class {
      /**
       * @description
       * Reports the value of the control if it is present, otherwise null.
       */
      get value() {
        return this.control ? this.control.value : null;
      }
      /**
       * @description
       * Reports whether the control is valid. A control is considered valid if no
       * validation errors exist with the current value.
       * If the control is not present, null is returned.
       */
      get valid() {
        return this.control ? this.control.valid : null;
      }
      /**
       * @description
       * Reports whether the control is invalid, meaning that an error exists in the input value.
       * If the control is not present, null is returned.
       */
      get invalid() {
        return this.control ? this.control.invalid : null;
      }
      /**
       * @description
       * Reports whether a control is pending, meaning that async validation is occurring and
       * errors are not yet available for the input value. If the control is not present, null is
       * returned.
       */
      get pending() {
        return this.control ? this.control.pending : null;
      }
      /**
       * @description
       * Reports whether the control is disabled, meaning that the control is disabled
       * in the UI and is exempt from validation checks and excluded from aggregate
       * values of ancestor controls. If the control is not present, null is returned.
       */
      get disabled() {
        return this.control ? this.control.disabled : null;
      }
      /**
       * @description
       * Reports whether the control is enabled, meaning that the control is included in ancestor
       * calculations of validity or value. If the control is not present, null is returned.
       */
      get enabled() {
        return this.control ? this.control.enabled : null;
      }
      /**
       * @description
       * Reports the control's validation errors. If the control is not present, null is returned.
       */
      get errors() {
        return this.control ? this.control.errors : null;
      }
      /**
       * @description
       * Reports whether the control is pristine, meaning that the user has not yet changed
       * the value in the UI. If the control is not present, null is returned.
       */
      get pristine() {
        return this.control ? this.control.pristine : null;
      }
      /**
       * @description
       * Reports whether the control is dirty, meaning that the user has changed
       * the value in the UI. If the control is not present, null is returned.
       */
      get dirty() {
        return this.control ? this.control.dirty : null;
      }
      /**
       * @description
       * Reports whether the control is touched, meaning that the user has triggered
       * a `blur` event on it. If the control is not present, null is returned.
       */
      get touched() {
        return this.control ? this.control.touched : null;
      }
      /**
       * @description
       * Reports the validation status of the control. Possible values include:
       * 'VALID', 'INVALID', 'DISABLED', and 'PENDING'.
       * If the control is not present, null is returned.
       */
      get status() {
        return this.control ? this.control.status : null;
      }
      /**
       * @description
       * Reports whether the control is untouched, meaning that the user has not yet triggered
       * a `blur` event on it. If the control is not present, null is returned.
       */
      get untouched() {
        return this.control ? this.control.untouched : null;
      }
      /**
       * @description
       * Returns a multicasting observable that emits a validation status whenever it is
       * calculated for the control. If the control is not present, null is returned.
       */
      get statusChanges() {
        return this.control ? this.control.statusChanges : null;
      }
      /**
       * @description
       * Returns a multicasting observable of value changes for the control that emits every time the
       * value of the control changes in the UI or programmatically.
       * If the control is not present, null is returned.
       */
      get valueChanges() {
        return this.control ? this.control.valueChanges : null;
      }
      /**
       * @description
       * Returns an array that represents the path from the top-level form to this control.
       * Each index is the string name of the control on that level.
       */
      get path() {
        return null;
      }
      /**
       * Contains the result of merging synchronous validators into a single validator function
       * (combined using `Validators.compose`).
       */
      _composedValidatorFn;
      /**
       * Contains the result of merging asynchronous validators into a single validator function
       * (combined using `Validators.composeAsync`).
       */
      _composedAsyncValidatorFn;
      /**
       * Set of synchronous validators as they were provided while calling `setValidators` function.
       * @internal
       */
      _rawValidators = [];
      /**
       * Set of asynchronous validators as they were provided while calling `setAsyncValidators`
       * function.
       * @internal
       */
      _rawAsyncValidators = [];
      /**
       * Sets synchronous validators for this directive.
       * @internal
       */
      _setValidators(validators) {
        this._rawValidators = validators || [];
        this._composedValidatorFn = composeValidators(this._rawValidators);
      }
      /**
       * Sets asynchronous validators for this directive.
       * @internal
       */
      _setAsyncValidators(validators) {
        this._rawAsyncValidators = validators || [];
        this._composedAsyncValidatorFn = composeAsyncValidators(this._rawAsyncValidators);
      }
      /**
       * @description
       * Synchronous validator function composed of all the synchronous validators registered with this
       * directive.
       */
      get validator() {
        return this._composedValidatorFn || null;
      }
      /**
       * @description
       * Asynchronous validator function composed of all the asynchronous validators registered with
       * this directive.
       */
      get asyncValidator() {
        return this._composedAsyncValidatorFn || null;
      }
      /*
       * The set of callbacks to be invoked when directive instance is being destroyed.
       */
      _onDestroyCallbacks = [];
      /**
       * Internal function to register callbacks that should be invoked
       * when directive instance is being destroyed.
       * @internal
       */
      _registerOnDestroy(fn) {
        this._onDestroyCallbacks.push(fn);
      }
      /**
       * Internal function to invoke all registered "on destroy" callbacks.
       * Note: calling this function also clears the list of callbacks.
       * @internal
       */
      _invokeOnDestroyCallbacks() {
        this._onDestroyCallbacks.forEach((fn) => fn());
        this._onDestroyCallbacks = [];
      }
      /**
       * @description
       * Resets the control with the provided value if the control is present.
       */
      reset(value = void 0) {
        if (this.control)
          this.control.reset(value);
      }
      /**
       * @description
       * Reports whether the control with the given path has the error specified.
       *
       * @param errorCode The code of the error to check
       * @param path A list of control names that designates how to move from the current control
       * to the control that should be queried for errors.
       *
       * @usageNotes
       * For example, for the following `FormGroup`:
       *
       * ```ts
       * form = new FormGroup({
       *   address: new FormGroup({ street: new FormControl() })
       * });
       * ```
       *
       * The path to the 'street' control from the root form would be 'address' -> 'street'.
       *
       * It can be provided to this method in one of two formats:
       *
       * 1. An array of string control names, e.g. `['address', 'street']`
       * 1. A period-delimited list of control names in one string, e.g. `'address.street'`
       *
       * If no path is given, this method checks for the error on the current control.
       *
       * @returns whether the given error is present in the control at the given path.
       *
       * If the control is not present, false is returned.
       */
      hasError(errorCode, path) {
        return this.control ? this.control.hasError(errorCode, path) : false;
      }
      /**
       * @description
       * Reports error data for the control with the given path.
       *
       * @param errorCode The code of the error to check
       * @param path A list of control names that designates how to move from the current control
       * to the control that should be queried for errors.
       *
       * @usageNotes
       * For example, for the following `FormGroup`:
       *
       * ```ts
       * form = new FormGroup({
       *   address: new FormGroup({ street: new FormControl() })
       * });
       * ```
       *
       * The path to the 'street' control from the root form would be 'address' -> 'street'.
       *
       * It can be provided to this method in one of two formats:
       *
       * 1. An array of string control names, e.g. `['address', 'street']`
       * 1. A period-delimited list of control names in one string, e.g. `'address.street'`
       *
       * @returns error data for that particular error. If the control or error is not present,
       * null is returned.
       */
      getError(errorCode, path) {
        return this.control ? this.control.getError(errorCode, path) : null;
      }
    };
    ControlContainer = class extends AbstractControlDirective {
      /**
       * @description
       * The name for the control
       */
      name;
      /**
       * @description
       * The top-level form directive for the control.
       */
      get formDirective() {
        return null;
      }
      /**
       * @description
       * The path to this group.
       */
      get path() {
        return null;
      }
    };
    NgControl = class extends AbstractControlDirective {
      /**
       * @description
       * The parent form for the control.
       *
       * @internal
       */
      _parent = null;
      /**
       * @description
       * The name for the control
       */
      name = null;
      /**
       * @description
       * The value accessor for the control
       */
      valueAccessor = null;
    };
    AbstractControlStatus = class {
      _cd;
      constructor(cd) {
        this._cd = cd;
      }
      get isTouched() {
        this._cd?.control?._touched?.();
        return !!this._cd?.control?.touched;
      }
      get isUntouched() {
        return !!this._cd?.control?.untouched;
      }
      get isPristine() {
        this._cd?.control?._pristine?.();
        return !!this._cd?.control?.pristine;
      }
      get isDirty() {
        return !!this._cd?.control?.dirty;
      }
      get isValid() {
        this._cd?.control?._status?.();
        return !!this._cd?.control?.valid;
      }
      get isInvalid() {
        return !!this._cd?.control?.invalid;
      }
      get isPending() {
        return !!this._cd?.control?.pending;
      }
      get isSubmitted() {
        this._cd?._submitted?.();
        return !!this._cd?.submitted;
      }
    };
    ngControlStatusHost = {
      "[class.ng-untouched]": "isUntouched",
      "[class.ng-touched]": "isTouched",
      "[class.ng-pristine]": "isPristine",
      "[class.ng-dirty]": "isDirty",
      "[class.ng-valid]": "isValid",
      "[class.ng-invalid]": "isInvalid",
      "[class.ng-pending]": "isPending"
    };
    ngGroupStatusHost = __spreadProps(__spreadValues({}, ngControlStatusHost), {
      "[class.ng-submitted]": "isSubmitted"
    });
    NgControlStatus = class _NgControlStatus extends AbstractControlStatus {
      constructor(cd) {
        super(cd);
      }
      static \u0275fac = \u0275\u0275ngDeclareFactory({ minVersion: "12.0.0", version: "20.3.11", ngImport: core_exports, type: _NgControlStatus, deps: [{ token: NgControl, self: true }], target: FactoryTarget.Directive });
      static \u0275dir = \u0275\u0275ngDeclareDirective({ minVersion: "14.0.0", version: "20.3.11", type: _NgControlStatus, isStandalone: false, selector: "[formControlName],[ngModel],[formControl]", host: { properties: { "class.ng-untouched": "isUntouched", "class.ng-touched": "isTouched", "class.ng-pristine": "isPristine", "class.ng-dirty": "isDirty", "class.ng-valid": "isValid", "class.ng-invalid": "isInvalid", "class.ng-pending": "isPending" } }, usesInheritance: true, ngImport: core_exports });
    };
    \u0275\u0275ngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.3.11", ngImport: core_exports, type: NgControlStatus, decorators: [{
      type: Directive,
      args: [{
        selector: "[formControlName],[ngModel],[formControl]",
        host: ngControlStatusHost,
        standalone: false
      }]
    }], ctorParameters: () => [{ type: NgControl, decorators: [{
      type: Self
    }] }] });
    NgControlStatusGroup = class _NgControlStatusGroup extends AbstractControlStatus {
      constructor(cd) {
        super(cd);
      }
      static \u0275fac = \u0275\u0275ngDeclareFactory({ minVersion: "12.0.0", version: "20.3.11", ngImport: core_exports, type: _NgControlStatusGroup, deps: [{ token: ControlContainer, optional: true, self: true }], target: FactoryTarget.Directive });
      static \u0275dir = \u0275\u0275ngDeclareDirective({ minVersion: "14.0.0", version: "20.3.11", type: _NgControlStatusGroup, isStandalone: false, selector: "[formGroupName],[formArrayName],[ngModelGroup],[formGroup],form:not([ngNoForm]),[ngForm]", host: { properties: { "class.ng-untouched": "isUntouched", "class.ng-touched": "isTouched", "class.ng-pristine": "isPristine", "class.ng-dirty": "isDirty", "class.ng-valid": "isValid", "class.ng-invalid": "isInvalid", "class.ng-pending": "isPending", "class.ng-submitted": "isSubmitted" } }, usesInheritance: true, ngImport: core_exports });
    };
    \u0275\u0275ngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.3.11", ngImport: core_exports, type: NgControlStatusGroup, decorators: [{
      type: Directive,
      args: [{
        selector: "[formGroupName],[formArrayName],[ngModelGroup],[formGroup],form:not([ngNoForm]),[ngForm]",
        host: ngGroupStatusHost,
        standalone: false
      }]
    }], ctorParameters: () => [{ type: ControlContainer, decorators: [{
      type: Optional
    }, {
      type: Self
    }] }] });
    formControlNameExample = `
  <div [formGroup]="myGroup">
    <input formControlName="firstName">
  </div>

  In your class:

  this.myGroup = new FormGroup({
      firstName: new FormControl()
  });`;
    formGroupNameExample = `
  <div [formGroup]="myGroup">
      <div formGroupName="person">
        <input formControlName="firstName">
      </div>
  </div>

  In your class:

  this.myGroup = new FormGroup({
      person: new FormGroup({ firstName: new FormControl() })
  });`;
    formArrayNameExample = `
  <div [formGroup]="myGroup">
    <div formArrayName="cities">
      <div *ngFor="let city of cityArray.controls; index as i">
        <input [formControlName]="i">
      </div>
    </div>
  </div>

  In your class:

  this.cityArray = new FormArray([new FormControl('SF')]);
  this.myGroup = new FormGroup({
    cities: this.cityArray
  });`;
    ngModelGroupExample = `
  <form>
      <div ngModelGroup="person">
        <input [(ngModel)]="person.name" name="firstName">
      </div>
  </form>`;
    ngModelWithFormGroupExample = `
  <div [formGroup]="myGroup">
      <input formControlName="firstName">
      <input [(ngModel)]="showMoreControls" [ngModelOptions]="{standalone: true}">
  </div>
`;
    disabledAttrWarning = `
  It looks like you're using the disabled attribute with a reactive form directive. If you set disabled to true
  when you set up this control in your component class, the disabled attribute will actually be set in the DOM for
  you. We recommend using this approach to avoid 'changed after checked' errors.

  Example:
  // Specify the \`disabled\` property at control creation time:
  form = new FormGroup({
    first: new FormControl({value: 'Nancy', disabled: true}, Validators.required),
    last: new FormControl('Drew', Validators.required)
  });

  // Controls can also be enabled/disabled after creation:
  form.get('first')?.enable();
  form.get('last')?.disable();
`;
    asyncValidatorsDroppedWithOptsWarning = `
  It looks like you're constructing using a FormControl with both an options argument and an
  async validators argument. Mixing these arguments will cause your async validators to be dropped.
  You should either put all your validators in the options object, or in separate validators
  arguments. For example:

  // Using validators arguments
  fc = new FormControl(42, Validators.required, myAsyncValidator);

  // Using AbstractControlOptions
  fc = new FormControl(42, {validators: Validators.required, asyncValidators: myAV});

  // Do NOT mix them: async validators will be dropped!
  fc = new FormControl(42, {validators: Validators.required}, /* Oops! */ myAsyncValidator);
`;
    VALID = "VALID";
    INVALID = "INVALID";
    PENDING = "PENDING";
    DISABLED = "DISABLED";
    ControlEvent = class {
    };
    ValueChangeEvent = class extends ControlEvent {
      value;
      source;
      constructor(value, source) {
        super();
        this.value = value;
        this.source = source;
      }
    };
    PristineChangeEvent = class extends ControlEvent {
      pristine;
      source;
      constructor(pristine, source) {
        super();
        this.pristine = pristine;
        this.source = source;
      }
    };
    TouchedChangeEvent = class extends ControlEvent {
      touched;
      source;
      constructor(touched, source) {
        super();
        this.touched = touched;
        this.source = source;
      }
    };
    StatusChangeEvent = class extends ControlEvent {
      status;
      source;
      constructor(status, source) {
        super();
        this.status = status;
        this.source = source;
      }
    };
    FormSubmittedEvent = class extends ControlEvent {
      source;
      constructor(source) {
        super();
        this.source = source;
      }
    };
    FormResetEvent = class extends ControlEvent {
      source;
      constructor(source) {
        super();
        this.source = source;
      }
    };
    AbstractControl = class {
      /** @internal */
      _pendingDirty = false;
      /**
       * Indicates that a control has its own pending asynchronous validation in progress.
       * It also stores if the control should emit events when the validation status changes.
       *
       * @internal
       */
      _hasOwnPendingAsyncValidator = null;
      /** @internal */
      _pendingTouched = false;
      /** @internal */
      _onCollectionChange = () => {
      };
      /** @internal */
      _updateOn;
      _parent = null;
      _asyncValidationSubscription;
      /**
       * Contains the result of merging synchronous validators into a single validator function
       * (combined using `Validators.compose`).
       *
       * @internal
       */
      _composedValidatorFn;
      /**
       * Contains the result of merging asynchronous validators into a single validator function
       * (combined using `Validators.composeAsync`).
       *
       * @internal
       */
      _composedAsyncValidatorFn;
      /**
       * Synchronous validators as they were provided:
       *  - in `AbstractControl` constructor
       *  - as an argument while calling `setValidators` function
       *  - while calling the setter on the `validator` field (e.g. `control.validator = validatorFn`)
       *
       * @internal
       */
      _rawValidators;
      /**
       * Asynchronous validators as they were provided:
       *  - in `AbstractControl` constructor
       *  - as an argument while calling `setAsyncValidators` function
       *  - while calling the setter on the `asyncValidator` field (e.g. `control.asyncValidator =
       * asyncValidatorFn`)
       *
       * @internal
       */
      _rawAsyncValidators;
      /**
       * The current value of the control.
       *
       * * For a `FormControl`, the current value.
       * * For an enabled `FormGroup`, the values of enabled controls as an object
       * with a key-value pair for each member of the group.
       * * For a disabled `FormGroup`, the values of all controls as an object
       * with a key-value pair for each member of the group.
       * * For a `FormArray`, the values of enabled controls as an array.
       *
       */
      value;
      /**
       * Initialize the AbstractControl instance.
       *
       * @param validators The function or array of functions that is used to determine the validity of
       *     this control synchronously.
       * @param asyncValidators The function or array of functions that is used to determine validity of
       *     this control asynchronously.
       */
      constructor(validators, asyncValidators) {
        this._assignValidators(validators);
        this._assignAsyncValidators(asyncValidators);
      }
      /**
       * Returns the function that is used to determine the validity of this control synchronously.
       * If multiple validators have been added, this will be a single composed function.
       * See `Validators.compose()` for additional information.
       */
      get validator() {
        return this._composedValidatorFn;
      }
      set validator(validatorFn) {
        this._rawValidators = this._composedValidatorFn = validatorFn;
      }
      /**
       * Returns the function that is used to determine the validity of this control asynchronously.
       * If multiple validators have been added, this will be a single composed function.
       * See `Validators.compose()` for additional information.
       */
      get asyncValidator() {
        return this._composedAsyncValidatorFn;
      }
      set asyncValidator(asyncValidatorFn) {
        this._rawAsyncValidators = this._composedAsyncValidatorFn = asyncValidatorFn;
      }
      /**
       * The parent control.
       */
      get parent() {
        return this._parent;
      }
      /**
       * The validation status of the control.
       *
       * @see {@link FormControlStatus}
       *
       * These status values are mutually exclusive, so a control cannot be
       * both valid AND invalid or invalid AND disabled.
       */
      get status() {
        return untracked(this.statusReactive);
      }
      set status(v) {
        untracked(() => this.statusReactive.set(v));
      }
      /** @internal */
      _status = computed(() => this.statusReactive(), ...ngDevMode ? [{ debugName: "_status" }] : []);
      statusReactive = signal(void 0, ...ngDevMode ? [{ debugName: "statusReactive" }] : []);
      /**
       * A control is `valid` when its `status` is `VALID`.
       *
       * @see {@link AbstractControl.status}
       *
       * @returns True if the control has passed all of its validation tests,
       * false otherwise.
       */
      get valid() {
        return this.status === VALID;
      }
      /**
       * A control is `invalid` when its `status` is `INVALID`.
       *
       * @see {@link AbstractControl.status}
       *
       * @returns True if this control has failed one or more of its validation checks,
       * false otherwise.
       */
      get invalid() {
        return this.status === INVALID;
      }
      /**
       * A control is `pending` when its `status` is `PENDING`.
       *
       * @see {@link AbstractControl.status}
       *
       * @returns True if this control is in the process of conducting a validation check,
       * false otherwise.
       */
      get pending() {
        return this.status == PENDING;
      }
      /**
       * A control is `disabled` when its `status` is `DISABLED`.
       *
       * Disabled controls are exempt from validation checks and
       * are not included in the aggregate value of their ancestor
       * controls.
       *
       * @see {@link AbstractControl.status}
       *
       * @returns True if the control is disabled, false otherwise.
       */
      get disabled() {
        return this.status === DISABLED;
      }
      /**
       * A control is `enabled` as long as its `status` is not `DISABLED`.
       *
       * @returns True if the control has any status other than 'DISABLED',
       * false if the status is 'DISABLED'.
       *
       * @see {@link AbstractControl.status}
       *
       */
      get enabled() {
        return this.status !== DISABLED;
      }
      /**
       * An object containing any errors generated by failing validation,
       * or null if there are no errors.
       */
      errors;
      /**
       * A control is `pristine` if the user has not yet changed
       * the value in the UI.
       *
       * @returns True if the user has not yet changed the value in the UI; compare `dirty`.
       * Programmatic changes to a control's value do not mark it dirty.
       */
      get pristine() {
        return untracked(this.pristineReactive);
      }
      set pristine(v) {
        untracked(() => this.pristineReactive.set(v));
      }
      /** @internal */
      _pristine = computed(() => this.pristineReactive(), ...ngDevMode ? [{ debugName: "_pristine" }] : []);
      pristineReactive = signal(true, ...ngDevMode ? [{ debugName: "pristineReactive" }] : []);
      /**
       * A control is `dirty` if the user has changed the value
       * in the UI.
       *
       * @returns True if the user has changed the value of this control in the UI; compare `pristine`.
       * Programmatic changes to a control's value do not mark it dirty.
       */
      get dirty() {
        return !this.pristine;
      }
      /**
       * True if the control is marked as `touched`.
       *
       * A control is marked `touched` once the user has triggered
       * a `blur` event on it.
       */
      get touched() {
        return untracked(this.touchedReactive);
      }
      set touched(v) {
        untracked(() => this.touchedReactive.set(v));
      }
      /** @internal */
      _touched = computed(() => this.touchedReactive(), ...ngDevMode ? [{ debugName: "_touched" }] : []);
      touchedReactive = signal(false, ...ngDevMode ? [{ debugName: "touchedReactive" }] : []);
      /**
       * True if the control has not been marked as touched
       *
       * A control is `untouched` if the user has not yet triggered
       * a `blur` event on it.
       */
      get untouched() {
        return !this.touched;
      }
      /**
       * Exposed as observable, see below.
       *
       * @internal
       */
      _events = new Subject();
      /**
       * A multicasting observable that emits an event every time the state of the control changes.
       * It emits for value, status, pristine or touched changes.
       *
       * **Note**: On value change, the emit happens right after a value of this control is updated. The
       * value of a parent control (for example if this FormControl is a part of a FormGroup) is updated
       * later, so accessing a value of a parent control (using the `value` property) from the callback
       * of this event might result in getting a value that has not been updated yet. Subscribe to the
       * `events` of the parent control instead.
       * For other event types, the events are emitted after the parent control has been updated.
       *
       * @see [Unified control state change events](guide/forms/reactive-forms#unified-control-state-change-events)
       */
      events = this._events.asObservable();
      /**
       * A multicasting observable that emits an event every time the value of the control changes, in
       * the UI or programmatically. It also emits an event each time you call enable() or disable()
       * without passing along {emitEvent: false} as a function argument.
       *
       * **Note**: the emit happens right after a value of this control is updated. The value of a
       * parent control (for example if this FormControl is a part of a FormGroup) is updated later, so
       * accessing a value of a parent control (using the `value` property) from the callback of this
       * event might result in getting a value that has not been updated yet. Subscribe to the
       * `valueChanges` event of the parent control instead.
       */
      valueChanges;
      /**
       * A multicasting observable that emits an event every time the validation `status` of the control
       * recalculates.
       *
       * @see {@link FormControlStatus}
       * @see {@link AbstractControl.status}
       */
      statusChanges;
      /**
       * Reports the update strategy of the `AbstractControl` (meaning
       * the event on which the control updates itself).
       * Possible values: `'change'` | `'blur'` | `'submit'`
       * Default value: `'change'`
       */
      get updateOn() {
        return this._updateOn ? this._updateOn : this.parent ? this.parent.updateOn : "change";
      }
      /**
       * Sets the synchronous validators that are active on this control.  Calling
       * this overwrites any existing synchronous validators.
       *
       * When you add or remove a validator at run time, you must call
       * `updateValueAndValidity()` for the new validation to take effect.
       *
       * If you want to add a new validator without affecting existing ones, consider
       * using `addValidators()` method instead.
       */
      setValidators(validators) {
        this._assignValidators(validators);
      }
      /**
       * Sets the asynchronous validators that are active on this control. Calling this
       * overwrites any existing asynchronous validators.
       *
       * When you add or remove a validator at run time, you must call
       * `updateValueAndValidity()` for the new validation to take effect.
       *
       * If you want to add a new validator without affecting existing ones, consider
       * using `addAsyncValidators()` method instead.
       */
      setAsyncValidators(validators) {
        this._assignAsyncValidators(validators);
      }
      /**
       * Add a synchronous validator or validators to this control, without affecting other validators.
       *
       * When you add or remove a validator at run time, you must call
       * `updateValueAndValidity()` for the new validation to take effect.
       *
       * Adding a validator that already exists will have no effect. If duplicate validator functions
       * are present in the `validators` array, only the first instance would be added to a form
       * control.
       *
       * @param validators The new validator function or functions to add to this control.
       */
      addValidators(validators) {
        this.setValidators(addValidators(validators, this._rawValidators));
      }
      /**
       * Add an asynchronous validator or validators to this control, without affecting other
       * validators.
       *
       * When you add or remove a validator at run time, you must call
       * `updateValueAndValidity()` for the new validation to take effect.
       *
       * Adding a validator that already exists will have no effect.
       *
       * @param validators The new asynchronous validator function or functions to add to this control.
       */
      addAsyncValidators(validators) {
        this.setAsyncValidators(addValidators(validators, this._rawAsyncValidators));
      }
      /**
       * Remove a synchronous validator from this control, without affecting other validators.
       * Validators are compared by function reference; you must pass a reference to the exact same
       * validator function as the one that was originally set. If a provided validator is not found,
       * it is ignored.
       *
       * @usageNotes
       *
       * ### Reference to a ValidatorFn
       *
       * ```
       * // Reference to the RequiredValidator
       * const ctrl = new FormControl<string | null>('', Validators.required);
       * ctrl.removeValidators(Validators.required);
       *
       * // Reference to anonymous function inside MinValidator
       * const minValidator = Validators.min(3);
       * const ctrl = new FormControl<string | null>('', minValidator);
       * expect(ctrl.hasValidator(minValidator)).toEqual(true)
       * expect(ctrl.hasValidator(Validators.min(3))).toEqual(false)
       *
       * ctrl.removeValidators(minValidator);
       * ```
       *
       * When you add or remove a validator at run time, you must call
       * `updateValueAndValidity()` for the new validation to take effect.
       *
       * @param validators The validator or validators to remove.
       */
      removeValidators(validators) {
        this.setValidators(removeValidators(validators, this._rawValidators));
      }
      /**
       * Remove an asynchronous validator from this control, without affecting other validators.
       * Validators are compared by function reference; you must pass a reference to the exact same
       * validator function as the one that was originally set. If a provided validator is not found, it
       * is ignored.
       *
       * When you add or remove a validator at run time, you must call
       * `updateValueAndValidity()` for the new validation to take effect.
       *
       * @param validators The asynchronous validator or validators to remove.
       */
      removeAsyncValidators(validators) {
        this.setAsyncValidators(removeValidators(validators, this._rawAsyncValidators));
      }
      /**
       * Check whether a synchronous validator function is present on this control. The provided
       * validator must be a reference to the exact same function that was provided.
       *
       * @usageNotes
       *
       * ### Reference to a ValidatorFn
       *
       * ```
       * // Reference to the RequiredValidator
       * const ctrl = new FormControl<number | null>(0, Validators.required);
       * expect(ctrl.hasValidator(Validators.required)).toEqual(true)
       *
       * // Reference to anonymous function inside MinValidator
       * const minValidator = Validators.min(3);
       * const ctrl = new FormControl<number | null>(0, minValidator);
       * expect(ctrl.hasValidator(minValidator)).toEqual(true)
       * expect(ctrl.hasValidator(Validators.min(3))).toEqual(false)
       * ```
       *
       * @param validator The validator to check for presence. Compared by function reference.
       * @returns Whether the provided validator was found on this control.
       */
      hasValidator(validator) {
        return hasValidator(this._rawValidators, validator);
      }
      /**
       * Check whether an asynchronous validator function is present on this control. The provided
       * validator must be a reference to the exact same function that was provided.
       *
       * @param validator The asynchronous validator to check for presence. Compared by function
       *     reference.
       * @returns Whether the provided asynchronous validator was found on this control.
       */
      hasAsyncValidator(validator) {
        return hasValidator(this._rawAsyncValidators, validator);
      }
      /**
       * Empties out the synchronous validator list.
       *
       * When you add or remove a validator at run time, you must call
       * `updateValueAndValidity()` for the new validation to take effect.
       *
       */
      clearValidators() {
        this.validator = null;
      }
      /**
       * Empties out the async validator list.
       *
       * When you add or remove a validator at run time, you must call
       * `updateValueAndValidity()` for the new validation to take effect.
       *
       */
      clearAsyncValidators() {
        this.asyncValidator = null;
      }
      markAsTouched(opts = {}) {
        const changed = this.touched === false;
        this.touched = true;
        const sourceControl = opts.sourceControl ?? this;
        if (this._parent && !opts.onlySelf) {
          this._parent.markAsTouched(__spreadProps(__spreadValues({}, opts), { sourceControl }));
        }
        if (changed && opts.emitEvent !== false) {
          this._events.next(new TouchedChangeEvent(true, sourceControl));
        }
      }
      /**
       * Marks the control and all its descendant controls as `dirty`.
       * @see {@link markAsDirty()}
       *
       * @param opts Configuration options that determine how the control propagates changes
       * and emits events after marking is applied.
       * * `emitEvent`: When true or not supplied (the default), the `events`
       * observable emits a `PristineChangeEvent` with the `pristine` property being `false`.
       * When false, no events are emitted.
       */
      markAllAsDirty(opts = {}) {
        this.markAsDirty({ onlySelf: true, emitEvent: opts.emitEvent, sourceControl: this });
        this._forEachChild((control) => control.markAllAsDirty(opts));
      }
      /**
       * Marks the control and all its descendant controls as `touched`.
       * @see {@link markAsTouched()}
       *
       * @param opts Configuration options that determine how the control propagates changes
       * and emits events after marking is applied.
       * * `emitEvent`: When true or not supplied (the default), the `events`
       * observable emits a `TouchedChangeEvent` with the `touched` property being `true`.
       * When false, no events are emitted.
       */
      markAllAsTouched(opts = {}) {
        this.markAsTouched({ onlySelf: true, emitEvent: opts.emitEvent, sourceControl: this });
        this._forEachChild((control) => control.markAllAsTouched(opts));
      }
      markAsUntouched(opts = {}) {
        const changed = this.touched === true;
        this.touched = false;
        this._pendingTouched = false;
        const sourceControl = opts.sourceControl ?? this;
        this._forEachChild((control) => {
          control.markAsUntouched({ onlySelf: true, emitEvent: opts.emitEvent, sourceControl });
        });
        if (this._parent && !opts.onlySelf) {
          this._parent._updateTouched(opts, sourceControl);
        }
        if (changed && opts.emitEvent !== false) {
          this._events.next(new TouchedChangeEvent(false, sourceControl));
        }
      }
      markAsDirty(opts = {}) {
        const changed = this.pristine === true;
        this.pristine = false;
        const sourceControl = opts.sourceControl ?? this;
        if (this._parent && !opts.onlySelf) {
          this._parent.markAsDirty(__spreadProps(__spreadValues({}, opts), { sourceControl }));
        }
        if (changed && opts.emitEvent !== false) {
          this._events.next(new PristineChangeEvent(false, sourceControl));
        }
      }
      markAsPristine(opts = {}) {
        const changed = this.pristine === false;
        this.pristine = true;
        this._pendingDirty = false;
        const sourceControl = opts.sourceControl ?? this;
        this._forEachChild((control) => {
          control.markAsPristine({ onlySelf: true, emitEvent: opts.emitEvent });
        });
        if (this._parent && !opts.onlySelf) {
          this._parent._updatePristine(opts, sourceControl);
        }
        if (changed && opts.emitEvent !== false) {
          this._events.next(new PristineChangeEvent(true, sourceControl));
        }
      }
      markAsPending(opts = {}) {
        this.status = PENDING;
        const sourceControl = opts.sourceControl ?? this;
        if (opts.emitEvent !== false) {
          this._events.next(new StatusChangeEvent(this.status, sourceControl));
          this.statusChanges.emit(this.status);
        }
        if (this._parent && !opts.onlySelf) {
          this._parent.markAsPending(__spreadProps(__spreadValues({}, opts), { sourceControl }));
        }
      }
      disable(opts = {}) {
        const skipPristineCheck = this._parentMarkedDirty(opts.onlySelf);
        this.status = DISABLED;
        this.errors = null;
        this._forEachChild((control) => {
          control.disable(__spreadProps(__spreadValues({}, opts), { onlySelf: true }));
        });
        this._updateValue();
        const sourceControl = opts.sourceControl ?? this;
        if (opts.emitEvent !== false) {
          this._events.next(new ValueChangeEvent(this.value, sourceControl));
          this._events.next(new StatusChangeEvent(this.status, sourceControl));
          this.valueChanges.emit(this.value);
          this.statusChanges.emit(this.status);
        }
        this._updateAncestors(__spreadProps(__spreadValues({}, opts), { skipPristineCheck }), this);
        this._onDisabledChange.forEach((changeFn) => changeFn(true));
      }
      /**
       * Enables the control. This means the control is included in validation checks and
       * the aggregate value of its parent. Its status recalculates based on its value and
       * its validators.
       *
       * By default, if the control has children, all children are enabled.
       *
       * @see {@link AbstractControl.status}
       *
       * @param opts Configure options that control how the control propagates changes and
       * emits events when marked as untouched
       * * `onlySelf`: When true, mark only this control. When false or not supplied,
       * marks all direct ancestors. Default is false.
       * * `emitEvent`: When true or not supplied (the default), the `statusChanges`,
       * `valueChanges` and `events`
       * observables emit events with the latest status and value when the control is enabled.
       * When false, no events are emitted.
       */
      enable(opts = {}) {
        const skipPristineCheck = this._parentMarkedDirty(opts.onlySelf);
        this.status = VALID;
        this._forEachChild((control) => {
          control.enable(__spreadProps(__spreadValues({}, opts), { onlySelf: true }));
        });
        this.updateValueAndValidity({ onlySelf: true, emitEvent: opts.emitEvent });
        this._updateAncestors(__spreadProps(__spreadValues({}, opts), { skipPristineCheck }), this);
        this._onDisabledChange.forEach((changeFn) => changeFn(false));
      }
      _updateAncestors(opts, sourceControl) {
        if (this._parent && !opts.onlySelf) {
          this._parent.updateValueAndValidity(opts);
          if (!opts.skipPristineCheck) {
            this._parent._updatePristine({}, sourceControl);
          }
          this._parent._updateTouched({}, sourceControl);
        }
      }
      /**
       * Sets the parent of the control
       *
       * @param parent The new parent.
       */
      setParent(parent) {
        this._parent = parent;
      }
      /**
       * The raw value of this control. For most control implementations, the raw value will include
       * disabled children.
       */
      getRawValue() {
        return this.value;
      }
      updateValueAndValidity(opts = {}) {
        this._setInitialStatus();
        this._updateValue();
        if (this.enabled) {
          const shouldHaveEmitted = this._cancelExistingSubscription();
          this.errors = this._runValidator();
          this.status = this._calculateStatus();
          if (this.status === VALID || this.status === PENDING) {
            this._runAsyncValidator(shouldHaveEmitted, opts.emitEvent);
          }
        }
        const sourceControl = opts.sourceControl ?? this;
        if (opts.emitEvent !== false) {
          this._events.next(new ValueChangeEvent(this.value, sourceControl));
          this._events.next(new StatusChangeEvent(this.status, sourceControl));
          this.valueChanges.emit(this.value);
          this.statusChanges.emit(this.status);
        }
        if (this._parent && !opts.onlySelf) {
          this._parent.updateValueAndValidity(__spreadProps(__spreadValues({}, opts), { sourceControl }));
        }
      }
      /** @internal */
      _updateTreeValidity(opts = { emitEvent: true }) {
        this._forEachChild((ctrl) => ctrl._updateTreeValidity(opts));
        this.updateValueAndValidity({ onlySelf: true, emitEvent: opts.emitEvent });
      }
      _setInitialStatus() {
        this.status = this._allControlsDisabled() ? DISABLED : VALID;
      }
      _runValidator() {
        return this.validator ? this.validator(this) : null;
      }
      _runAsyncValidator(shouldHaveEmitted, emitEvent) {
        if (this.asyncValidator) {
          this.status = PENDING;
          this._hasOwnPendingAsyncValidator = {
            emitEvent: emitEvent !== false,
            shouldHaveEmitted: shouldHaveEmitted !== false
          };
          const obs = toObservable(this.asyncValidator(this));
          this._asyncValidationSubscription = obs.subscribe((errors) => {
            this._hasOwnPendingAsyncValidator = null;
            this.setErrors(errors, { emitEvent, shouldHaveEmitted });
          });
        }
      }
      _cancelExistingSubscription() {
        if (this._asyncValidationSubscription) {
          this._asyncValidationSubscription.unsubscribe();
          const shouldHaveEmitted = (this._hasOwnPendingAsyncValidator?.emitEvent || this._hasOwnPendingAsyncValidator?.shouldHaveEmitted) ?? false;
          this._hasOwnPendingAsyncValidator = null;
          return shouldHaveEmitted;
        }
        return false;
      }
      setErrors(errors, opts = {}) {
        this.errors = errors;
        this._updateControlsErrors(opts.emitEvent !== false, this, opts.shouldHaveEmitted);
      }
      /**
       * Retrieves a child control given the control's name or path.
       *
       * @param path A dot-delimited string or array of string/number values that define the path to the
       * control. If a string is provided, passing it as a string literal will result in improved type
       * information. Likewise, if an array is provided, passing it `as const` will cause improved type
       * information to be available.
       *
       * @usageNotes
       * ### Retrieve a nested control
       *
       * For example, to get a `name` control nested within a `person` sub-group:
       *
       * * `this.form.get('person.name');`
       *
       * -OR-
       *
       * * `this.form.get(['person', 'name'] as const);` // `as const` gives improved typings
       *
       * ### Retrieve a control in a FormArray
       *
       * When accessing an element inside a FormArray, you can use an element index.
       * For example, to get a `price` control from the first element in an `items` array you can use:
       *
       * * `this.form.get('items.0.price');`
       *
       * -OR-
       *
       * * `this.form.get(['items', 0, 'price']);`
       */
      get(path) {
        let currPath = path;
        if (currPath == null)
          return null;
        if (!Array.isArray(currPath))
          currPath = currPath.split(".");
        if (currPath.length === 0)
          return null;
        return currPath.reduce((control, name) => control && control._find(name), this);
      }
      /**
       * @description
       * Reports error data for the control with the given path.
       *
       * @param errorCode The code of the error to check
       * @param path A list of control names that designates how to move from the current control
       * to the control that should be queried for errors.
       *
       * @usageNotes
       * For example, for the following `FormGroup`:
       *
       * ```ts
       * form = new FormGroup({
       *   address: new FormGroup({ street: new FormControl() })
       * });
       * ```
       *
       * The path to the 'street' control from the root form would be 'address' -> 'street'.
       *
       * It can be provided to this method in one of two formats:
       *
       * 1. An array of string control names, e.g. `['address', 'street']`
       * 1. A period-delimited list of control names in one string, e.g. `'address.street'`
       *
       * @returns error data for that particular error. If the control or error is not present,
       * null is returned.
       */
      getError(errorCode, path) {
        const control = path ? this.get(path) : this;
        return control && control.errors ? control.errors[errorCode] : null;
      }
      /**
       * @description
       * Reports whether the control with the given path has the error specified.
       *
       * @param errorCode The code of the error to check
       * @param path A list of control names that designates how to move from the current control
       * to the control that should be queried for errors.
       *
       * @usageNotes
       * For example, for the following `FormGroup`:
       *
       * ```ts
       * form = new FormGroup({
       *   address: new FormGroup({ street: new FormControl() })
       * });
       * ```
       *
       * The path to the 'street' control from the root form would be 'address' -> 'street'.
       *
       * It can be provided to this method in one of two formats:
       *
       * 1. An array of string control names, e.g. `['address', 'street']`
       * 1. A period-delimited list of control names in one string, e.g. `'address.street'`
       *
       * If no path is given, this method checks for the error on the current control.
       *
       * @returns whether the given error is present in the control at the given path.
       *
       * If the control is not present, false is returned.
       */
      hasError(errorCode, path) {
        return !!this.getError(errorCode, path);
      }
      /**
       * Retrieves the top-level ancestor of this control.
       */
      get root() {
        let x = this;
        while (x._parent) {
          x = x._parent;
        }
        return x;
      }
      /** @internal */
      _updateControlsErrors(emitEvent, changedControl, shouldHaveEmitted) {
        this.status = this._calculateStatus();
        if (emitEvent) {
          this.statusChanges.emit(this.status);
        }
        if (emitEvent || shouldHaveEmitted) {
          this._events.next(new StatusChangeEvent(this.status, changedControl));
        }
        if (this._parent) {
          this._parent._updateControlsErrors(emitEvent, changedControl, shouldHaveEmitted);
        }
      }
      /** @internal */
      _initObservables() {
        this.valueChanges = new EventEmitter();
        this.statusChanges = new EventEmitter();
      }
      _calculateStatus() {
        if (this._allControlsDisabled())
          return DISABLED;
        if (this.errors)
          return INVALID;
        if (this._hasOwnPendingAsyncValidator || this._anyControlsHaveStatus(PENDING))
          return PENDING;
        if (this._anyControlsHaveStatus(INVALID))
          return INVALID;
        return VALID;
      }
      /** @internal */
      _anyControlsHaveStatus(status) {
        return this._anyControls((control) => control.status === status);
      }
      /** @internal */
      _anyControlsDirty() {
        return this._anyControls((control) => control.dirty);
      }
      /** @internal */
      _anyControlsTouched() {
        return this._anyControls((control) => control.touched);
      }
      /** @internal */
      _updatePristine(opts, changedControl) {
        const newPristine = !this._anyControlsDirty();
        const changed = this.pristine !== newPristine;
        this.pristine = newPristine;
        if (this._parent && !opts.onlySelf) {
          this._parent._updatePristine(opts, changedControl);
        }
        if (changed) {
          this._events.next(new PristineChangeEvent(this.pristine, changedControl));
        }
      }
      /** @internal */
      _updateTouched(opts = {}, changedControl) {
        this.touched = this._anyControlsTouched();
        this._events.next(new TouchedChangeEvent(this.touched, changedControl));
        if (this._parent && !opts.onlySelf) {
          this._parent._updateTouched(opts, changedControl);
        }
      }
      /** @internal */
      _onDisabledChange = [];
      /** @internal */
      _registerOnCollectionChange(fn) {
        this._onCollectionChange = fn;
      }
      /** @internal */
      _setUpdateStrategy(opts) {
        if (isOptionsObj(opts) && opts.updateOn != null) {
          this._updateOn = opts.updateOn;
        }
      }
      /**
       * Check to see if parent has been marked artificially dirty.
       *
       * @internal
       */
      _parentMarkedDirty(onlySelf) {
        const parentDirty = this._parent && this._parent.dirty;
        return !onlySelf && !!parentDirty && !this._parent._anyControlsDirty();
      }
      /** @internal */
      _find(name) {
        return null;
      }
      /**
       * Internal implementation of the `setValidators` method. Needs to be separated out into a
       * different method, because it is called in the constructor and it can break cases where
       * a control is extended.
       */
      _assignValidators(validators) {
        this._rawValidators = Array.isArray(validators) ? validators.slice() : validators;
        this._composedValidatorFn = coerceToValidator(this._rawValidators);
      }
      /**
       * Internal implementation of the `setAsyncValidators` method. Needs to be separated out into a
       * different method, because it is called in the constructor and it can break cases where
       * a control is extended.
       */
      _assignAsyncValidators(validators) {
        this._rawAsyncValidators = Array.isArray(validators) ? validators.slice() : validators;
        this._composedAsyncValidatorFn = coerceToAsyncValidator(this._rawAsyncValidators);
      }
    };
    FormGroup = class extends AbstractControl {
      /**
       * Creates a new `FormGroup` instance.
       *
       * @param controls A collection of child controls. The key for each child is the name
       * under which it is registered.
       *
       * @param validatorOrOpts A synchronous validator function, or an array of
       * such functions, or an `AbstractControlOptions` object that contains validation functions
       * and a validation trigger.
       *
       * @param asyncValidator A single async validator or array of async validator functions
       *
       */
      constructor(controls, validatorOrOpts, asyncValidator) {
        super(pickValidators(validatorOrOpts), pickAsyncValidators(asyncValidator, validatorOrOpts));
        (typeof ngDevMode === "undefined" || ngDevMode) && validateFormGroupControls(controls);
        this.controls = controls;
        this._initObservables();
        this._setUpdateStrategy(validatorOrOpts);
        this._setUpControls();
        this.updateValueAndValidity({
          onlySelf: true,
          // If `asyncValidator` is present, it will trigger control status change from `PENDING` to
          // `VALID` or `INVALID`. The status should be broadcasted via the `statusChanges` observable,
          // so we set `emitEvent` to `true` to allow that during the control creation process.
          emitEvent: !!this.asyncValidator
        });
      }
      controls;
      registerControl(name, control) {
        if (this.controls[name])
          return this.controls[name];
        this.controls[name] = control;
        control.setParent(this);
        control._registerOnCollectionChange(this._onCollectionChange);
        return control;
      }
      addControl(name, control, options = {}) {
        this.registerControl(name, control);
        this.updateValueAndValidity({ emitEvent: options.emitEvent });
        this._onCollectionChange();
      }
      /**
       * Remove a control from this group. In a strongly-typed group, required controls cannot be
       * removed.
       *
       * This method also updates the value and validity of the control.
       *
       * @param name The control name to remove from the collection
       * @param options Specifies whether this FormGroup instance should emit events after a
       *     control is removed.
       * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
       * `valueChanges` observables emit events with the latest status and value when the control is
       * removed. When false, no events are emitted.
       */
      removeControl(name, options = {}) {
        if (this.controls[name])
          this.controls[name]._registerOnCollectionChange(() => {
          });
        delete this.controls[name];
        this.updateValueAndValidity({ emitEvent: options.emitEvent });
        this._onCollectionChange();
      }
      setControl(name, control, options = {}) {
        if (this.controls[name])
          this.controls[name]._registerOnCollectionChange(() => {
          });
        delete this.controls[name];
        if (control)
          this.registerControl(name, control);
        this.updateValueAndValidity({ emitEvent: options.emitEvent });
        this._onCollectionChange();
      }
      contains(controlName) {
        return this.controls.hasOwnProperty(controlName) && this.controls[controlName].enabled;
      }
      /**
       * Sets the value of the `FormGroup`. It accepts an object that matches
       * the structure of the group, with control names as keys.
       *
       * @usageNotes
       * ### Set the complete value for the form group
       *
       * ```ts
       * const form = new FormGroup({
       *   first: new FormControl(),
       *   last: new FormControl()
       * });
       *
       * console.log(form.value);   // {first: null, last: null}
       *
       * form.setValue({first: 'Nancy', last: 'Drew'});
       * console.log(form.value);   // {first: 'Nancy', last: 'Drew'}
       * ```
       *
       * @throws When strict checks fail, such as setting the value of a control
       * that doesn't exist or if you exclude a value of a control that does exist.
       *
       * @param value The new value for the control that matches the structure of the group.
       * @param options Configuration options that determine how the control propagates changes
       * and emits events after the value changes.
       * The configuration options are passed to the {@link AbstractControl#updateValueAndValidity
       * updateValueAndValidity} method.
       *
       * * `onlySelf`: When true, each change only affects this control, and not its parent. Default is
       * false.
       * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
       * `valueChanges`
       * observables emit events with the latest status and value when the control value is updated.
       * When false, no events are emitted.
       */
      setValue(value, options = {}) {
        assertAllValuesPresent(this, true, value);
        Object.keys(value).forEach((name) => {
          assertControlPresent(this, true, name);
          this.controls[name].setValue(value[name], {
            onlySelf: true,
            emitEvent: options.emitEvent
          });
        });
        this.updateValueAndValidity(options);
      }
      /**
       * Patches the value of the `FormGroup`. It accepts an object with control
       * names as keys, and does its best to match the values to the correct controls
       * in the group.
       *
       * It accepts both super-sets and sub-sets of the group without throwing an error.
       *
       * @usageNotes
       * ### Patch the value for a form group
       *
       * ```ts
       * const form = new FormGroup({
       *    first: new FormControl(),
       *    last: new FormControl()
       * });
       * console.log(form.value);   // {first: null, last: null}
       *
       * form.patchValue({first: 'Nancy'});
       * console.log(form.value);   // {first: 'Nancy', last: null}
       * ```
       *
       * @param value The object that matches the structure of the group.
       * @param options Configuration options that determine how the control propagates changes and
       * emits events after the value is patched.
       * * `onlySelf`: When true, each change only affects this control and not its parent. Default is
       * true.
       * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
       * `valueChanges` observables emit events with the latest status and value when the control value
       * is updated. When false, no events are emitted. The configuration options are passed to
       * the {@link AbstractControl#updateValueAndValidity updateValueAndValidity} method.
       */
      patchValue(value, options = {}) {
        if (value == null)
          return;
        Object.keys(value).forEach((name) => {
          const control = this.controls[name];
          if (control) {
            control.patchValue(
              /* Guaranteed to be present, due to the outer forEach. */
              value[name],
              { onlySelf: true, emitEvent: options.emitEvent }
            );
          }
        });
        this.updateValueAndValidity(options);
      }
      /**
       * Resets the `FormGroup`, marks all descendants `pristine` and `untouched` and sets
       * the value of all descendants to their default values, or null if no defaults were provided.
       *
       * You reset to a specific form state by passing in a map of states
       * that matches the structure of your form, with control names as keys. The state
       * is a standalone value or a form state object with both a value and a disabled
       * status.
       *
       * @param value Resets the control with an initial value,
       * or an object that defines the initial value and disabled state.
       *
       * @param options Configuration options that determine how the control propagates changes
       * and emits events when the group is reset.
       * * `onlySelf`: When true, each change only affects this control, and not its parent. Default is
       * false.
       * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
       * `valueChanges`
       * observables emit events with the latest status and value when the control is reset.
       * When false, no events are emitted.
       * The configuration options are passed to the {@link AbstractControl#updateValueAndValidity
       * updateValueAndValidity} method.
       *
       * @usageNotes
       *
       * ### Reset the form group values
       *
       * ```ts
       * const form = new FormGroup({
       *   first: new FormControl('first name'),
       *   last: new FormControl('last name')
       * });
       *
       * console.log(form.value);  // {first: 'first name', last: 'last name'}
       *
       * form.reset({ first: 'name', last: 'last name' });
       *
       * console.log(form.value);  // {first: 'name', last: 'last name'}
       * ```
       *
       * ### Reset the form group values and disabled status
       *
       * ```ts
       * const form = new FormGroup({
       *   first: new FormControl('first name'),
       *   last: new FormControl('last name')
       * });
       *
       * form.reset({
       *   first: {value: 'name', disabled: true},
       *   last: 'last'
       * });
       *
       * console.log(form.value);  // {last: 'last'}
       * console.log(form.get('first').status);  // 'DISABLED'
       * ```
       */
      reset(value = {}, options = {}) {
        this._forEachChild((control, name) => {
          control.reset(value ? value[name] : null, {
            onlySelf: true,
            emitEvent: options.emitEvent
          });
        });
        this._updatePristine(options, this);
        this._updateTouched(options, this);
        this.updateValueAndValidity(options);
        if (options?.emitEvent !== false) {
          this._events.next(new FormResetEvent(this));
        }
      }
      /**
       * The aggregate value of the `FormGroup`, including any disabled controls.
       *
       * Retrieves all values regardless of disabled status.
       */
      getRawValue() {
        return this._reduceChildren({}, (acc, control, name) => {
          acc[name] = control.getRawValue();
          return acc;
        });
      }
      /** @internal */
      _syncPendingControls() {
        let subtreeUpdated = this._reduceChildren(false, (updated, child) => {
          return child._syncPendingControls() ? true : updated;
        });
        if (subtreeUpdated)
          this.updateValueAndValidity({ onlySelf: true });
        return subtreeUpdated;
      }
      /** @internal */
      _forEachChild(cb) {
        Object.keys(this.controls).forEach((key) => {
          const control = this.controls[key];
          control && cb(control, key);
        });
      }
      /** @internal */
      _setUpControls() {
        this._forEachChild((control) => {
          control.setParent(this);
          control._registerOnCollectionChange(this._onCollectionChange);
        });
      }
      /** @internal */
      _updateValue() {
        this.value = this._reduceValue();
      }
      /** @internal */
      _anyControls(condition) {
        for (const [controlName, control] of Object.entries(this.controls)) {
          if (this.contains(controlName) && condition(control)) {
            return true;
          }
        }
        return false;
      }
      /** @internal */
      _reduceValue() {
        let acc = {};
        return this._reduceChildren(acc, (acc2, control, name) => {
          if (control.enabled || this.disabled) {
            acc2[name] = control.value;
          }
          return acc2;
        });
      }
      /** @internal */
      _reduceChildren(initValue, fn) {
        let res = initValue;
        this._forEachChild((control, name) => {
          res = fn(res, control, name);
        });
        return res;
      }
      /** @internal */
      _allControlsDisabled() {
        for (const controlName of Object.keys(this.controls)) {
          if (this.controls[controlName].enabled) {
            return false;
          }
        }
        return Object.keys(this.controls).length > 0 || this.disabled;
      }
      /** @internal */
      _find(name) {
        return this.controls.hasOwnProperty(name) ? this.controls[name] : null;
      }
    };
    FormRecord = class extends FormGroup {
    };
    CALL_SET_DISABLED_STATE = new InjectionToken(typeof ngDevMode === "undefined" || ngDevMode ? "CallSetDisabledState" : "", {
      providedIn: "root",
      factory: () => setDisabledStateDefault
    });
    setDisabledStateDefault = "always";
    formDirectiveProvider$1 = {
      provide: ControlContainer,
      useExisting: forwardRef(() => NgForm)
    };
    resolvedPromise$1 = (() => Promise.resolve())();
    NgForm = class _NgForm extends ControlContainer {
      callSetDisabledState;
      /**
       * @description
       * Returns whether the form submission has been triggered.
       */
      get submitted() {
        return untracked(this.submittedReactive);
      }
      /** @internal */
      _submitted = computed(() => this.submittedReactive(), ...ngDevMode ? [{ debugName: "_submitted" }] : []);
      submittedReactive = signal(false, ...ngDevMode ? [{ debugName: "submittedReactive" }] : []);
      _directives = /* @__PURE__ */ new Set();
      /**
       * @description
       * The `FormGroup` instance created for this form.
       */
      form;
      /**
       * @description
       * Event emitter for the "ngSubmit" event
       */
      ngSubmit = new EventEmitter();
      /**
       * @description
       * Tracks options for the `NgForm` instance.
       *
       * **updateOn**: Sets the default `updateOn` value for all child `NgModels` below it
       * unless explicitly set by a child `NgModel` using `ngModelOptions`). Defaults to 'change'.
       * Possible values: `'change'` | `'blur'` | `'submit'`.
       *
       */
      options;
      constructor(validators, asyncValidators, callSetDisabledState) {
        super();
        this.callSetDisabledState = callSetDisabledState;
        this.form = new FormGroup({}, composeValidators(validators), composeAsyncValidators(asyncValidators));
      }
      /** @docs-private */
      ngAfterViewInit() {
        this._setUpdateStrategy();
      }
      /**
       * @description
       * The directive instance.
       */
      get formDirective() {
        return this;
      }
      /**
       * @description
       * The internal `FormGroup` instance.
       */
      get control() {
        return this.form;
      }
      /**
       * @description
       * Returns an array representing the path to this group. Because this directive
       * always lives at the top level of a form, it is always an empty array.
       */
      get path() {
        return [];
      }
      /**
       * @description
       * Returns a map of the controls in this group.
       */
      get controls() {
        return this.form.controls;
      }
      /**
       * @description
       * Method that sets up the control directive in this group, re-calculates its value
       * and validity, and adds the instance to the internal list of directives.
       *
       * @param dir The `NgModel` directive instance.
       */
      addControl(dir) {
        resolvedPromise$1.then(() => {
          const container = this._findContainer(dir.path);
          dir.control = container.registerControl(dir.name, dir.control);
          setUpControl(dir.control, dir, this.callSetDisabledState);
          dir.control.updateValueAndValidity({ emitEvent: false });
          this._directives.add(dir);
        });
      }
      /**
       * @description
       * Retrieves the `FormControl` instance from the provided `NgModel` directive.
       *
       * @param dir The `NgModel` directive instance.
       */
      getControl(dir) {
        return this.form.get(dir.path);
      }
      /**
       * @description
       * Removes the `NgModel` instance from the internal list of directives
       *
       * @param dir The `NgModel` directive instance.
       */
      removeControl(dir) {
        resolvedPromise$1.then(() => {
          const container = this._findContainer(dir.path);
          if (container) {
            container.removeControl(dir.name);
          }
          this._directives.delete(dir);
        });
      }
      /**
       * @description
       * Adds a new `NgModelGroup` directive instance to the form.
       *
       * @param dir The `NgModelGroup` directive instance.
       */
      addFormGroup(dir) {
        resolvedPromise$1.then(() => {
          const container = this._findContainer(dir.path);
          const group = new FormGroup({});
          setUpFormContainer(group, dir);
          container.registerControl(dir.name, group);
          group.updateValueAndValidity({ emitEvent: false });
        });
      }
      /**
       * @description
       * Removes the `NgModelGroup` directive instance from the form.
       *
       * @param dir The `NgModelGroup` directive instance.
       */
      removeFormGroup(dir) {
        resolvedPromise$1.then(() => {
          const container = this._findContainer(dir.path);
          if (container) {
            container.removeControl(dir.name);
          }
        });
      }
      /**
       * @description
       * Retrieves the `FormGroup` for a provided `NgModelGroup` directive instance
       *
       * @param dir The `NgModelGroup` directive instance.
       */
      getFormGroup(dir) {
        return this.form.get(dir.path);
      }
      /**
       * Sets the new value for the provided `NgControl` directive.
       *
       * @param dir The `NgControl` directive instance.
       * @param value The new value for the directive's control.
       */
      updateModel(dir, value) {
        resolvedPromise$1.then(() => {
          const ctrl = this.form.get(dir.path);
          ctrl.setValue(value);
        });
      }
      /**
       * @description
       * Sets the value for this `FormGroup`.
       *
       * @param value The new value
       */
      setValue(value) {
        this.control.setValue(value);
      }
      /**
       * @description
       * Method called when the "submit" event is triggered on the form.
       * Triggers the `ngSubmit` emitter to emit the "submit" event as its payload.
       *
       * @param $event The "submit" event object
       */
      onSubmit($event) {
        this.submittedReactive.set(true);
        syncPendingControls(this.form, this._directives);
        this.ngSubmit.emit($event);
        this.form._events.next(new FormSubmittedEvent(this.control));
        return $event?.target?.method === "dialog";
      }
      /**
       * @description
       * Method called when the "reset" event is triggered on the form.
       */
      onReset() {
        this.resetForm();
      }
      /**
       * @description
       * Resets the form to an initial value and resets its submitted status.
       *
       * @param value The new value for the form.
       */
      resetForm(value = void 0) {
        this.form.reset(value);
        this.submittedReactive.set(false);
      }
      _setUpdateStrategy() {
        if (this.options && this.options.updateOn != null) {
          this.form._updateOn = this.options.updateOn;
        }
      }
      _findContainer(path) {
        path.pop();
        return path.length ? this.form.get(path) : this.form;
      }
      static \u0275fac = \u0275\u0275ngDeclareFactory({ minVersion: "12.0.0", version: "20.3.11", ngImport: core_exports, type: _NgForm, deps: [{ token: NG_VALIDATORS, optional: true, self: true }, { token: NG_ASYNC_VALIDATORS, optional: true, self: true }, { token: CALL_SET_DISABLED_STATE, optional: true }], target: FactoryTarget.Directive });
      static \u0275dir = \u0275\u0275ngDeclareDirective({ minVersion: "14.0.0", version: "20.3.11", type: _NgForm, isStandalone: false, selector: "form:not([ngNoForm]):not([formGroup]),ng-form,[ngForm]", inputs: { options: ["ngFormOptions", "options"] }, outputs: { ngSubmit: "ngSubmit" }, host: { listeners: { "submit": "onSubmit($event)", "reset": "onReset()" } }, providers: [formDirectiveProvider$1], exportAs: ["ngForm"], usesInheritance: true, ngImport: core_exports });
    };
    \u0275\u0275ngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.3.11", ngImport: core_exports, type: NgForm, decorators: [{
      type: Directive,
      args: [{
        selector: "form:not([ngNoForm]):not([formGroup]),ng-form,[ngForm]",
        providers: [formDirectiveProvider$1],
        host: { "(submit)": "onSubmit($event)", "(reset)": "onReset()" },
        outputs: ["ngSubmit"],
        exportAs: "ngForm",
        standalone: false
      }]
    }], ctorParameters: () => [{ type: void 0, decorators: [{
      type: Optional
    }, {
      type: Self
    }, {
      type: Inject,
      args: [NG_VALIDATORS]
    }] }, { type: void 0, decorators: [{
      type: Optional
    }, {
      type: Self
    }, {
      type: Inject,
      args: [NG_ASYNC_VALIDATORS]
    }] }, { type: void 0, decorators: [{
      type: Optional
    }, {
      type: Inject,
      args: [CALL_SET_DISABLED_STATE]
    }] }], propDecorators: { options: [{
      type: Input,
      args: ["ngFormOptions"]
    }] } });
    FormControl = class FormControl2 extends AbstractControl {
      /** @publicApi */
      defaultValue = null;
      /** @internal */
      _onChange = [];
      /** @internal */
      _pendingValue;
      /** @internal */
      _pendingChange = false;
      constructor(formState = null, validatorOrOpts, asyncValidator) {
        super(pickValidators(validatorOrOpts), pickAsyncValidators(asyncValidator, validatorOrOpts));
        this._applyFormState(formState);
        this._setUpdateStrategy(validatorOrOpts);
        this._initObservables();
        this.updateValueAndValidity({
          onlySelf: true,
          // If `asyncValidator` is present, it will trigger control status change from `PENDING` to
          // `VALID` or `INVALID`.
          // The status should be broadcasted via the `statusChanges` observable, so we set
          // `emitEvent` to `true` to allow that during the control creation process.
          emitEvent: !!this.asyncValidator
        });
        if (isOptionsObj(validatorOrOpts) && (validatorOrOpts.nonNullable || validatorOrOpts.initialValueIsDefault)) {
          if (isFormControlState(formState)) {
            this.defaultValue = formState.value;
          } else {
            this.defaultValue = formState;
          }
        }
      }
      setValue(value, options = {}) {
        this.value = this._pendingValue = value;
        if (this._onChange.length && options.emitModelToViewChange !== false) {
          this._onChange.forEach((changeFn) => changeFn(this.value, options.emitViewToModelChange !== false));
        }
        this.updateValueAndValidity(options);
      }
      patchValue(value, options = {}) {
        this.setValue(value, options);
      }
      reset(formState = this.defaultValue, options = {}) {
        this._applyFormState(formState);
        this.markAsPristine(options);
        this.markAsUntouched(options);
        this.setValue(this.value, options);
        this._pendingChange = false;
        if (options?.emitEvent !== false) {
          this._events.next(new FormResetEvent(this));
        }
      }
      /**  @internal */
      _updateValue() {
      }
      /**  @internal */
      _anyControls(condition) {
        return false;
      }
      /**  @internal */
      _allControlsDisabled() {
        return this.disabled;
      }
      registerOnChange(fn) {
        this._onChange.push(fn);
      }
      /** @internal */
      _unregisterOnChange(fn) {
        removeListItem(this._onChange, fn);
      }
      registerOnDisabledChange(fn) {
        this._onDisabledChange.push(fn);
      }
      /** @internal */
      _unregisterOnDisabledChange(fn) {
        removeListItem(this._onDisabledChange, fn);
      }
      /** @internal */
      _forEachChild(cb) {
      }
      /** @internal */
      _syncPendingControls() {
        if (this.updateOn === "submit") {
          if (this._pendingDirty)
            this.markAsDirty();
          if (this._pendingTouched)
            this.markAsTouched();
          if (this._pendingChange) {
            this.setValue(this._pendingValue, { onlySelf: true, emitModelToViewChange: false });
            return true;
          }
        }
        return false;
      }
      _applyFormState(formState) {
        if (isFormControlState(formState)) {
          this.value = this._pendingValue = formState.value;
          formState.disabled ? this.disable({ onlySelf: true, emitEvent: false }) : this.enable({ onlySelf: true, emitEvent: false });
        } else {
          this.value = this._pendingValue = formState;
        }
      }
    };
    isFormControl = (control) => control instanceof FormControl;
    AbstractFormGroupDirective = class _AbstractFormGroupDirective extends ControlContainer {
      /**
       * @description
       * The parent control for the group
       *
       * @internal
       */
      _parent;
      /** @docs-private */
      ngOnInit() {
        this._checkParentType();
        this.formDirective.addFormGroup(this);
      }
      /** @docs-private */
      ngOnDestroy() {
        if (this.formDirective) {
          this.formDirective.removeFormGroup(this);
        }
      }
      /**
       * @description
       * The `FormGroup` bound to this directive.
       */
      get control() {
        return this.formDirective.getFormGroup(this);
      }
      /**
       * @description
       * The path to this group from the top-level directive.
       */
      get path() {
        return controlPath(this.name == null ? this.name : this.name.toString(), this._parent);
      }
      /**
       * @description
       * The top-level directive for this group if present, otherwise null.
       */
      get formDirective() {
        return this._parent ? this._parent.formDirective : null;
      }
      /** @internal */
      _checkParentType() {
      }
      static \u0275fac = \u0275\u0275ngDeclareFactory({ minVersion: "12.0.0", version: "20.3.11", ngImport: core_exports, type: _AbstractFormGroupDirective, deps: null, target: FactoryTarget.Directive });
      static \u0275dir = \u0275\u0275ngDeclareDirective({ minVersion: "14.0.0", version: "20.3.11", type: _AbstractFormGroupDirective, isStandalone: false, usesInheritance: true, ngImport: core_exports });
    };
    \u0275\u0275ngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.3.11", ngImport: core_exports, type: AbstractFormGroupDirective, decorators: [{
      type: Directive,
      args: [{
        standalone: false
      }]
    }] });
    modelGroupProvider = {
      provide: ControlContainer,
      useExisting: forwardRef(() => NgModelGroup)
    };
    NgModelGroup = class _NgModelGroup extends AbstractFormGroupDirective {
      /**
       * @description
       * Tracks the name of the `NgModelGroup` bound to the directive. The name corresponds
       * to a key in the parent `NgForm`.
       */
      name = "";
      constructor(parent, validators, asyncValidators) {
        super();
        this._parent = parent;
        this._setValidators(validators);
        this._setAsyncValidators(asyncValidators);
      }
      /** @internal */
      _checkParentType() {
        if (!(this._parent instanceof _NgModelGroup) && !(this._parent instanceof NgForm) && (typeof ngDevMode === "undefined" || ngDevMode)) {
          throw modelGroupParentException();
        }
      }
      static \u0275fac = \u0275\u0275ngDeclareFactory({ minVersion: "12.0.0", version: "20.3.11", ngImport: core_exports, type: _NgModelGroup, deps: [{ token: ControlContainer, host: true, skipSelf: true }, { token: NG_VALIDATORS, optional: true, self: true }, { token: NG_ASYNC_VALIDATORS, optional: true, self: true }], target: FactoryTarget.Directive });
      static \u0275dir = \u0275\u0275ngDeclareDirective({ minVersion: "14.0.0", version: "20.3.11", type: _NgModelGroup, isStandalone: false, selector: "[ngModelGroup]", inputs: { name: ["ngModelGroup", "name"] }, providers: [modelGroupProvider], exportAs: ["ngModelGroup"], usesInheritance: true, ngImport: core_exports });
    };
    \u0275\u0275ngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.3.11", ngImport: core_exports, type: NgModelGroup, decorators: [{
      type: Directive,
      args: [{
        selector: "[ngModelGroup]",
        providers: [modelGroupProvider],
        exportAs: "ngModelGroup",
        standalone: false
      }]
    }], ctorParameters: () => [{ type: ControlContainer, decorators: [{
      type: Host
    }, {
      type: SkipSelf
    }] }, { type: void 0, decorators: [{
      type: Optional
    }, {
      type: Self
    }, {
      type: Inject,
      args: [NG_VALIDATORS]
    }] }, { type: void 0, decorators: [{
      type: Optional
    }, {
      type: Self
    }, {
      type: Inject,
      args: [NG_ASYNC_VALIDATORS]
    }] }], propDecorators: { name: [{
      type: Input,
      args: ["ngModelGroup"]
    }] } });
    formControlBinding$1 = {
      provide: NgControl,
      useExisting: forwardRef(() => NgModel)
    };
    resolvedPromise = (() => Promise.resolve())();
    NgModel = class _NgModel extends NgControl {
      _changeDetectorRef;
      callSetDisabledState;
      control = new FormControl();
      // At runtime we coerce arbitrary values assigned to the "disabled" input to a "boolean".
      // This is not reflected in the type of the property because outside of templates, consumers
      // should only deal with booleans. In templates, a string is allowed for convenience and to
      // match the native "disabled attribute" semantics which can be observed on input elements.
      // This static member tells the compiler that values of type "string" can also be assigned
      // to the input in a template.
      /** @docs-private */
      static ngAcceptInputType_isDisabled;
      /** @internal */
      _registered = false;
      /**
       * Internal reference to the view model value.
       * @docs-private
       */
      viewModel;
      /**
       * @description
       * Tracks the name bound to the directive. If a parent form exists, it
       * uses this name as a key to retrieve this control's value.
       */
      name = "";
      /**
       * @description
       * Tracks whether the control is disabled.
       */
      isDisabled;
      /**
       * @description
       * Tracks the value bound to this directive.
       */
      model;
      /**
       * @description
       * Tracks the configuration options for this `ngModel` instance.
       *
       * **name**: An alternative to setting the name attribute on the form control element. See
       * the [example](api/forms/NgModel#using-ngmodel-on-a-standalone-control) for using `NgModel`
       * as a standalone control.
       *
       * **standalone**: When set to true, the `ngModel` will not register itself with its parent form,
       * and acts as if it's not in the form. Defaults to false. If no parent form exists, this option
       * has no effect.
       *
       * **updateOn**: Defines the event upon which the form control value and validity update.
       * Defaults to 'change'. Possible values: `'change'` | `'blur'` | `'submit'`.
       *
       */
      options;
      /**
       * @description
       * Event emitter for producing the `ngModelChange` event after
       * the view model updates.
       */
      update = new EventEmitter();
      constructor(parent, validators, asyncValidators, valueAccessors, _changeDetectorRef, callSetDisabledState) {
        super();
        this._changeDetectorRef = _changeDetectorRef;
        this.callSetDisabledState = callSetDisabledState;
        this._parent = parent;
        this._setValidators(validators);
        this._setAsyncValidators(asyncValidators);
        this.valueAccessor = selectValueAccessor(this, valueAccessors);
      }
      /** @docs-private */
      ngOnChanges(changes) {
        this._checkForErrors();
        if (!this._registered || "name" in changes) {
          if (this._registered) {
            this._checkName();
            if (this.formDirective) {
              const oldName = changes["name"].previousValue;
              this.formDirective.removeControl({ name: oldName, path: this._getPath(oldName) });
            }
          }
          this._setUpControl();
        }
        if ("isDisabled" in changes) {
          this._updateDisabled(changes);
        }
        if (isPropertyUpdated(changes, this.viewModel)) {
          this._updateValue(this.model);
          this.viewModel = this.model;
        }
      }
      /** @docs-private */
      ngOnDestroy() {
        this.formDirective && this.formDirective.removeControl(this);
      }
      /**
       * @description
       * Returns an array that represents the path from the top-level form to this control.
       * Each index is the string name of the control on that level.
       */
      get path() {
        return this._getPath(this.name);
      }
      /**
       * @description
       * The top-level directive for this control if present, otherwise null.
       */
      get formDirective() {
        return this._parent ? this._parent.formDirective : null;
      }
      /**
       * @description
       * Sets the new value for the view model and emits an `ngModelChange` event.
       *
       * @param newValue The new value emitted by `ngModelChange`.
       */
      viewToModelUpdate(newValue) {
        this.viewModel = newValue;
        this.update.emit(newValue);
      }
      _setUpControl() {
        this._setUpdateStrategy();
        this._isStandalone() ? this._setUpStandalone() : this.formDirective.addControl(this);
        this._registered = true;
      }
      _setUpdateStrategy() {
        if (this.options && this.options.updateOn != null) {
          this.control._updateOn = this.options.updateOn;
        }
      }
      _isStandalone() {
        return !this._parent || !!(this.options && this.options.standalone);
      }
      _setUpStandalone() {
        setUpControl(this.control, this, this.callSetDisabledState);
        this.control.updateValueAndValidity({ emitEvent: false });
      }
      _checkForErrors() {
        if ((typeof ngDevMode === "undefined" || ngDevMode) && !this._isStandalone()) {
          checkParentType$1(this._parent);
        }
        this._checkName();
      }
      _checkName() {
        if (this.options && this.options.name)
          this.name = this.options.name;
        if (!this._isStandalone() && !this.name && (typeof ngDevMode === "undefined" || ngDevMode)) {
          throw missingNameException();
        }
      }
      _updateValue(value) {
        resolvedPromise.then(() => {
          this.control.setValue(value, { emitViewToModelChange: false });
          this._changeDetectorRef?.markForCheck();
        });
      }
      _updateDisabled(changes) {
        const disabledValue = changes["isDisabled"].currentValue;
        const isDisabled = disabledValue !== 0 && booleanAttribute(disabledValue);
        resolvedPromise.then(() => {
          if (isDisabled && !this.control.disabled) {
            this.control.disable();
          } else if (!isDisabled && this.control.disabled) {
            this.control.enable();
          }
          this._changeDetectorRef?.markForCheck();
        });
      }
      _getPath(controlName) {
        return this._parent ? controlPath(controlName, this._parent) : [controlName];
      }
      static \u0275fac = \u0275\u0275ngDeclareFactory({ minVersion: "12.0.0", version: "20.3.11", ngImport: core_exports, type: _NgModel, deps: [{ token: ControlContainer, host: true, optional: true }, { token: NG_VALIDATORS, optional: true, self: true }, { token: NG_ASYNC_VALIDATORS, optional: true, self: true }, { token: NG_VALUE_ACCESSOR, optional: true, self: true }, { token: ChangeDetectorRef, optional: true }, { token: CALL_SET_DISABLED_STATE, optional: true }], target: FactoryTarget.Directive });
      static \u0275dir = \u0275\u0275ngDeclareDirective({ minVersion: "14.0.0", version: "20.3.11", type: _NgModel, isStandalone: false, selector: "[ngModel]:not([formControlName]):not([formControl])", inputs: { name: "name", isDisabled: ["disabled", "isDisabled"], model: ["ngModel", "model"], options: ["ngModelOptions", "options"] }, outputs: { update: "ngModelChange" }, providers: [formControlBinding$1], exportAs: ["ngModel"], usesInheritance: true, usesOnChanges: true, ngImport: core_exports });
    };
    \u0275\u0275ngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.3.11", ngImport: core_exports, type: NgModel, decorators: [{
      type: Directive,
      args: [{
        selector: "[ngModel]:not([formControlName]):not([formControl])",
        providers: [formControlBinding$1],
        exportAs: "ngModel",
        standalone: false
      }]
    }], ctorParameters: () => [{ type: ControlContainer, decorators: [{
      type: Optional
    }, {
      type: Host
    }] }, { type: void 0, decorators: [{
      type: Optional
    }, {
      type: Self
    }, {
      type: Inject,
      args: [NG_VALIDATORS]
    }] }, { type: void 0, decorators: [{
      type: Optional
    }, {
      type: Self
    }, {
      type: Inject,
      args: [NG_ASYNC_VALIDATORS]
    }] }, { type: void 0, decorators: [{
      type: Optional
    }, {
      type: Self
    }, {
      type: Inject,
      args: [NG_VALUE_ACCESSOR]
    }] }, { type: ChangeDetectorRef, decorators: [{
      type: Optional
    }, {
      type: Inject,
      args: [ChangeDetectorRef]
    }] }, { type: void 0, decorators: [{
      type: Optional
    }, {
      type: Inject,
      args: [CALL_SET_DISABLED_STATE]
    }] }], propDecorators: { name: [{
      type: Input
    }], isDisabled: [{
      type: Input,
      args: ["disabled"]
    }], model: [{
      type: Input,
      args: ["ngModel"]
    }], options: [{
      type: Input,
      args: ["ngModelOptions"]
    }], update: [{
      type: Output,
      args: ["ngModelChange"]
    }] } });
    \u0275NgNoValidate = class _\u0275NgNoValidate {
      static \u0275fac = \u0275\u0275ngDeclareFactory({ minVersion: "12.0.0", version: "20.3.11", ngImport: core_exports, type: _\u0275NgNoValidate, deps: [], target: FactoryTarget.Directive });
      static \u0275dir = \u0275\u0275ngDeclareDirective({ minVersion: "14.0.0", version: "20.3.11", type: _\u0275NgNoValidate, isStandalone: false, selector: "form:not([ngNoForm]):not([ngNativeValidate])", host: { attributes: { "novalidate": "" } }, ngImport: core_exports });
    };
    \u0275\u0275ngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.3.11", ngImport: core_exports, type: \u0275NgNoValidate, decorators: [{
      type: Directive,
      args: [{
        selector: "form:not([ngNoForm]):not([ngNativeValidate])",
        host: { "novalidate": "" },
        standalone: false
      }]
    }] });
    NUMBER_VALUE_ACCESSOR = {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NumberValueAccessor),
      multi: true
    };
    NumberValueAccessor = class _NumberValueAccessor extends BuiltInControlValueAccessor {
      /**
       * Sets the "value" property on the input element.
       * @docs-private
       */
      writeValue(value) {
        const normalizedValue = value == null ? "" : value;
        this.setProperty("value", normalizedValue);
      }
      /**
       * Registers a function called when the control value changes.
       * @docs-private
       */
      registerOnChange(fn) {
        this.onChange = (value) => {
          fn(value == "" ? null : parseFloat(value));
        };
      }
      static \u0275fac = \u0275\u0275ngDeclareFactory({ minVersion: "12.0.0", version: "20.3.11", ngImport: core_exports, type: _NumberValueAccessor, deps: null, target: FactoryTarget.Directive });
      static \u0275dir = \u0275\u0275ngDeclareDirective({ minVersion: "14.0.0", version: "20.3.11", type: _NumberValueAccessor, isStandalone: false, selector: "input[type=number][formControlName],input[type=number][formControl],input[type=number][ngModel]", host: { listeners: { "input": "onChange($any($event.target).value)", "blur": "onTouched()" } }, providers: [NUMBER_VALUE_ACCESSOR], usesInheritance: true, ngImport: core_exports });
    };
    \u0275\u0275ngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.3.11", ngImport: core_exports, type: NumberValueAccessor, decorators: [{
      type: Directive,
      args: [{
        selector: "input[type=number][formControlName],input[type=number][formControl],input[type=number][ngModel]",
        host: { "(input)": "onChange($any($event.target).value)", "(blur)": "onTouched()" },
        providers: [NUMBER_VALUE_ACCESSOR],
        standalone: false
      }]
    }] });
    RADIO_VALUE_ACCESSOR = {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioControlValueAccessor),
      multi: true
    };
    RadioControlRegistry = class _RadioControlRegistry {
      _accessors = [];
      /**
       * @description
       * Adds a control to the internal registry. For internal use only.
       */
      add(control, accessor) {
        this._accessors.push([control, accessor]);
      }
      /**
       * @description
       * Removes a control from the internal registry. For internal use only.
       */
      remove(accessor) {
        for (let i = this._accessors.length - 1; i >= 0; --i) {
          if (this._accessors[i][1] === accessor) {
            this._accessors.splice(i, 1);
            return;
          }
        }
      }
      /**
       * @description
       * Selects a radio button. For internal use only.
       */
      select(accessor) {
        this._accessors.forEach((c) => {
          if (this._isSameGroup(c, accessor) && c[1] !== accessor) {
            c[1].fireUncheck(accessor.value);
          }
        });
      }
      _isSameGroup(controlPair, accessor) {
        if (!controlPair[0].control)
          return false;
        return controlPair[0]._parent === accessor._control._parent && controlPair[1].name === accessor.name;
      }
      static \u0275fac = \u0275\u0275ngDeclareFactory({ minVersion: "12.0.0", version: "20.3.11", ngImport: core_exports, type: _RadioControlRegistry, deps: [], target: FactoryTarget.Injectable });
      static \u0275prov = \u0275\u0275ngDeclareInjectable({ minVersion: "12.0.0", version: "20.3.11", ngImport: core_exports, type: _RadioControlRegistry, providedIn: "root" });
    };
    \u0275\u0275ngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.3.11", ngImport: core_exports, type: RadioControlRegistry, decorators: [{
      type: Injectable,
      args: [{ providedIn: "root" }]
    }] });
    RadioControlValueAccessor = class _RadioControlValueAccessor extends BuiltInControlValueAccessor {
      _registry;
      _injector;
      /** @internal */
      _state;
      /** @internal */
      _control;
      /** @internal */
      _fn;
      setDisabledStateFired = false;
      /**
       * The registered callback function called when a change event occurs on the input element.
       * Note: we declare `onChange` here (also used as host listener) as a function with no arguments
       * to override the `onChange` function (which expects 1 argument) in the parent
       * `BaseControlValueAccessor` class.
       * @docs-private
       */
      onChange = () => {
      };
      /**
       * @description
       * Tracks the name of the radio input element.
       */
      name;
      /**
       * @description
       * Tracks the name of the `FormControl` bound to the directive. The name corresponds
       * to a key in the parent `FormGroup` or `FormArray`.
       */
      formControlName;
      /**
       * @description
       * Tracks the value of the radio input element
       */
      value;
      callSetDisabledState = inject(CALL_SET_DISABLED_STATE, { optional: true }) ?? setDisabledStateDefault;
      constructor(renderer, elementRef, _registry, _injector) {
        super(renderer, elementRef);
        this._registry = _registry;
        this._injector = _injector;
      }
      /** @docs-private */
      ngOnInit() {
        this._control = this._injector.get(NgControl);
        this._checkName();
        this._registry.add(this._control, this);
      }
      /** @docs-private */
      ngOnDestroy() {
        this._registry.remove(this);
      }
      /**
       * Sets the "checked" property value on the radio input element.
       * @docs-private
       */
      writeValue(value) {
        this._state = value === this.value;
        this.setProperty("checked", this._state);
      }
      /**
       * Registers a function called when the control value changes.
       * @docs-private
       */
      registerOnChange(fn) {
        this._fn = fn;
        this.onChange = () => {
          fn(this.value);
          this._registry.select(this);
        };
      }
      /** @docs-private */
      setDisabledState(isDisabled) {
        if (this.setDisabledStateFired || isDisabled || this.callSetDisabledState === "whenDisabledForLegacyCode") {
          this.setProperty("disabled", isDisabled);
        }
        this.setDisabledStateFired = true;
      }
      /**
       * Sets the "value" on the radio input element and unchecks it.
       *
       * @param value
       */
      fireUncheck(value) {
        this.writeValue(value);
      }
      _checkName() {
        if (this.name && this.formControlName && this.name !== this.formControlName && (typeof ngDevMode === "undefined" || ngDevMode)) {
          throwNameError();
        }
        if (!this.name && this.formControlName)
          this.name = this.formControlName;
      }
      static \u0275fac = \u0275\u0275ngDeclareFactory({ minVersion: "12.0.0", version: "20.3.11", ngImport: core_exports, type: _RadioControlValueAccessor, deps: [{ token: Renderer2 }, { token: ElementRef }, { token: RadioControlRegistry }, { token: Injector }], target: FactoryTarget.Directive });
      static \u0275dir = \u0275\u0275ngDeclareDirective({ minVersion: "14.0.0", version: "20.3.11", type: _RadioControlValueAccessor, isStandalone: false, selector: "input[type=radio][formControlName],input[type=radio][formControl],input[type=radio][ngModel]", inputs: { name: "name", formControlName: "formControlName", value: "value" }, host: { listeners: { "change": "onChange()", "blur": "onTouched()" } }, providers: [RADIO_VALUE_ACCESSOR], usesInheritance: true, ngImport: core_exports });
    };
    \u0275\u0275ngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.3.11", ngImport: core_exports, type: RadioControlValueAccessor, decorators: [{
      type: Directive,
      args: [{
        selector: "input[type=radio][formControlName],input[type=radio][formControl],input[type=radio][ngModel]",
        host: { "(change)": "onChange()", "(blur)": "onTouched()" },
        providers: [RADIO_VALUE_ACCESSOR],
        standalone: false
      }]
    }], ctorParameters: () => [{ type: Renderer2 }, { type: ElementRef }, { type: RadioControlRegistry }, { type: Injector }], propDecorators: { name: [{
      type: Input
    }], formControlName: [{
      type: Input
    }], value: [{
      type: Input
    }] } });
    RANGE_VALUE_ACCESSOR = {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RangeValueAccessor),
      multi: true
    };
    RangeValueAccessor = class _RangeValueAccessor extends BuiltInControlValueAccessor {
      /**
       * Sets the "value" property on the input element.
       * @docs-private
       */
      writeValue(value) {
        this.setProperty("value", parseFloat(value));
      }
      /**
       * Registers a function called when the control value changes.
       * @docs-private
       */
      registerOnChange(fn) {
        this.onChange = (value) => {
          fn(value == "" ? null : parseFloat(value));
        };
      }
      static \u0275fac = \u0275\u0275ngDeclareFactory({ minVersion: "12.0.0", version: "20.3.11", ngImport: core_exports, type: _RangeValueAccessor, deps: null, target: FactoryTarget.Directive });
      static \u0275dir = \u0275\u0275ngDeclareDirective({ minVersion: "14.0.0", version: "20.3.11", type: _RangeValueAccessor, isStandalone: false, selector: "input[type=range][formControlName],input[type=range][formControl],input[type=range][ngModel]", host: { listeners: { "change": "onChange($any($event.target).value)", "input": "onChange($any($event.target).value)", "blur": "onTouched()" } }, providers: [RANGE_VALUE_ACCESSOR], usesInheritance: true, ngImport: core_exports });
    };
    \u0275\u0275ngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.3.11", ngImport: core_exports, type: RangeValueAccessor, decorators: [{
      type: Directive,
      args: [{
        selector: "input[type=range][formControlName],input[type=range][formControl],input[type=range][ngModel]",
        host: {
          "(change)": "onChange($any($event.target).value)",
          "(input)": "onChange($any($event.target).value)",
          "(blur)": "onTouched()"
        },
        providers: [RANGE_VALUE_ACCESSOR],
        standalone: false
      }]
    }] });
    NG_MODEL_WITH_FORM_CONTROL_WARNING = new InjectionToken(ngDevMode ? "NgModelWithFormControlWarning" : "");
    formControlBinding = {
      provide: NgControl,
      useExisting: forwardRef(() => FormControlDirective)
    };
    FormControlDirective = class _FormControlDirective extends NgControl {
      _ngModelWarningConfig;
      callSetDisabledState;
      /**
       * Internal reference to the view model value.
       * @docs-private
       */
      viewModel;
      /**
       * @description
       * Tracks the `FormControl` instance bound to the directive.
       */
      form;
      /**
       * @description
       * Triggers a warning in dev mode that this input should not be used with reactive forms.
       */
      set isDisabled(isDisabled) {
        if (typeof ngDevMode === "undefined" || ngDevMode) {
          console.warn(disabledAttrWarning);
        }
      }
      // TODO(kara): remove next 4 properties once deprecation period is over
      /** @deprecated as of v6 */
      model;
      /** @deprecated as of v6 */
      update = new EventEmitter();
      /**
       * @description
       * Static property used to track whether any ngModel warnings have been sent across
       * all instances of FormControlDirective. Used to support warning config of "once".
       *
       * @internal
       */
      static _ngModelWarningSentOnce = false;
      /**
       * @description
       * Instance property used to track whether an ngModel warning has been sent out for this
       * particular `FormControlDirective` instance. Used to support warning config of "always".
       *
       * @internal
       */
      _ngModelWarningSent = false;
      constructor(validators, asyncValidators, valueAccessors, _ngModelWarningConfig, callSetDisabledState) {
        super();
        this._ngModelWarningConfig = _ngModelWarningConfig;
        this.callSetDisabledState = callSetDisabledState;
        this._setValidators(validators);
        this._setAsyncValidators(asyncValidators);
        this.valueAccessor = selectValueAccessor(this, valueAccessors);
      }
      /** @docs-private */
      ngOnChanges(changes) {
        if (this._isControlChanged(changes)) {
          const previousForm = changes["form"].previousValue;
          if (previousForm) {
            cleanUpControl(
              previousForm,
              this,
              /* validateControlPresenceOnChange */
              false
            );
          }
          setUpControl(this.form, this, this.callSetDisabledState);
          this.form.updateValueAndValidity({ emitEvent: false });
        }
        if (isPropertyUpdated(changes, this.viewModel)) {
          if (typeof ngDevMode === "undefined" || ngDevMode) {
            _ngModelWarning("formControl", _FormControlDirective, this, this._ngModelWarningConfig);
          }
          this.form.setValue(this.model);
          this.viewModel = this.model;
        }
      }
      /** @docs-private */
      ngOnDestroy() {
        if (this.form) {
          cleanUpControl(
            this.form,
            this,
            /* validateControlPresenceOnChange */
            false
          );
        }
      }
      /**
       * @description
       * Returns an array that represents the path from the top-level form to this control.
       * Each index is the string name of the control on that level.
       */
      get path() {
        return [];
      }
      /**
       * @description
       * The `FormControl` bound to this directive.
       */
      get control() {
        return this.form;
      }
      /**
       * @description
       * Sets the new value for the view model and emits an `ngModelChange` event.
       *
       * @param newValue The new value for the view model.
       */
      viewToModelUpdate(newValue) {
        this.viewModel = newValue;
        this.update.emit(newValue);
      }
      _isControlChanged(changes) {
        return changes.hasOwnProperty("form");
      }
      static \u0275fac = \u0275\u0275ngDeclareFactory({ minVersion: "12.0.0", version: "20.3.11", ngImport: core_exports, type: _FormControlDirective, deps: [{ token: NG_VALIDATORS, optional: true, self: true }, { token: NG_ASYNC_VALIDATORS, optional: true, self: true }, { token: NG_VALUE_ACCESSOR, optional: true, self: true }, { token: NG_MODEL_WITH_FORM_CONTROL_WARNING, optional: true }, { token: CALL_SET_DISABLED_STATE, optional: true }], target: FactoryTarget.Directive });
      static \u0275dir = \u0275\u0275ngDeclareDirective({ minVersion: "14.0.0", version: "20.3.11", type: _FormControlDirective, isStandalone: false, selector: "[formControl]", inputs: { form: ["formControl", "form"], isDisabled: ["disabled", "isDisabled"], model: ["ngModel", "model"] }, outputs: { update: "ngModelChange" }, providers: [formControlBinding], exportAs: ["ngForm"], usesInheritance: true, usesOnChanges: true, ngImport: core_exports });
    };
    \u0275\u0275ngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.3.11", ngImport: core_exports, type: FormControlDirective, decorators: [{
      type: Directive,
      args: [{
        selector: "[formControl]",
        providers: [formControlBinding],
        exportAs: "ngForm",
        standalone: false
      }]
    }], ctorParameters: () => [{ type: void 0, decorators: [{
      type: Optional
    }, {
      type: Self
    }, {
      type: Inject,
      args: [NG_VALIDATORS]
    }] }, { type: void 0, decorators: [{
      type: Optional
    }, {
      type: Self
    }, {
      type: Inject,
      args: [NG_ASYNC_VALIDATORS]
    }] }, { type: void 0, decorators: [{
      type: Optional
    }, {
      type: Self
    }, {
      type: Inject,
      args: [NG_VALUE_ACCESSOR]
    }] }, { type: void 0, decorators: [{
      type: Optional
    }, {
      type: Inject,
      args: [NG_MODEL_WITH_FORM_CONTROL_WARNING]
    }] }, { type: void 0, decorators: [{
      type: Optional
    }, {
      type: Inject,
      args: [CALL_SET_DISABLED_STATE]
    }] }], propDecorators: { form: [{
      type: Input,
      args: ["formControl"]
    }], isDisabled: [{
      type: Input,
      args: ["disabled"]
    }], model: [{
      type: Input,
      args: ["ngModel"]
    }], update: [{
      type: Output,
      args: ["ngModelChange"]
    }] } });
    formDirectiveProvider = {
      provide: ControlContainer,
      useExisting: forwardRef(() => FormGroupDirective)
    };
    FormGroupDirective = class _FormGroupDirective extends ControlContainer {
      callSetDisabledState;
      /**
       * @description
       * Reports whether the form submission has been triggered.
       */
      get submitted() {
        return untracked(this._submittedReactive);
      }
      // TODO(atscott): Remove once invalid API usage is cleaned up internally
      set submitted(value) {
        this._submittedReactive.set(value);
      }
      /** @internal */
      _submitted = computed(() => this._submittedReactive(), ...ngDevMode ? [{ debugName: "_submitted" }] : []);
      _submittedReactive = signal(false, ...ngDevMode ? [{ debugName: "_submittedReactive" }] : []);
      /**
       * Reference to an old form group input value, which is needed to cleanup
       * old instance in case it was replaced with a new one.
       */
      _oldForm;
      /**
       * Callback that should be invoked when controls in FormGroup or FormArray collection change
       * (added or removed). This callback triggers corresponding DOM updates.
       */
      _onCollectionChange = () => this._updateDomValue();
      /**
       * @description
       * Tracks the list of added `FormControlName` instances
       */
      directives = [];
      /**
       * @description
       * Tracks the `FormGroup` bound to this directive.
       */
      form = null;
      /**
       * @description
       * Emits an event when the form submission has been triggered.
       */
      ngSubmit = new EventEmitter();
      constructor(validators, asyncValidators, callSetDisabledState) {
        super();
        this.callSetDisabledState = callSetDisabledState;
        this._setValidators(validators);
        this._setAsyncValidators(asyncValidators);
      }
      /** @docs-private */
      ngOnChanges(changes) {
        if ((typeof ngDevMode === "undefined" || ngDevMode) && !this.form) {
          throw missingFormException();
        }
        if (changes.hasOwnProperty("form")) {
          this._updateValidators();
          this._updateDomValue();
          this._updateRegistrations();
          this._oldForm = this.form;
        }
      }
      /** @docs-private */
      ngOnDestroy() {
        if (this.form) {
          cleanUpValidators(this.form, this);
          if (this.form._onCollectionChange === this._onCollectionChange) {
            this.form._registerOnCollectionChange(() => {
            });
          }
        }
      }
      /**
       * @description
       * Returns this directive's instance.
       */
      get formDirective() {
        return this;
      }
      /**
       * @description
       * Returns the `FormGroup` bound to this directive.
       */
      get control() {
        return this.form;
      }
      /**
       * @description
       * Returns an array representing the path to this group. Because this directive
       * always lives at the top level of a form, it always an empty array.
       */
      get path() {
        return [];
      }
      /**
       * @description
       * Method that sets up the control directive in this group, re-calculates its value
       * and validity, and adds the instance to the internal list of directives.
       *
       * @param dir The `FormControlName` directive instance.
       */
      addControl(dir) {
        const ctrl = this.form.get(dir.path);
        setUpControl(ctrl, dir, this.callSetDisabledState);
        ctrl.updateValueAndValidity({ emitEvent: false });
        this.directives.push(dir);
        return ctrl;
      }
      /**
       * @description
       * Retrieves the `FormControl` instance from the provided `FormControlName` directive
       *
       * @param dir The `FormControlName` directive instance.
       */
      getControl(dir) {
        return this.form.get(dir.path);
      }
      /**
       * @description
       * Removes the `FormControlName` instance from the internal list of directives
       *
       * @param dir The `FormControlName` directive instance.
       */
      removeControl(dir) {
        cleanUpControl(
          dir.control || null,
          dir,
          /* validateControlPresenceOnChange */
          false
        );
        removeListItem$1(this.directives, dir);
      }
      /**
       * Adds a new `FormGroupName` directive instance to the form.
       *
       * @param dir The `FormGroupName` directive instance.
       */
      addFormGroup(dir) {
        this._setUpFormContainer(dir);
      }
      /**
       * Performs the necessary cleanup when a `FormGroupName` directive instance is removed from the
       * view.
       *
       * @param dir The `FormGroupName` directive instance.
       */
      removeFormGroup(dir) {
        this._cleanUpFormContainer(dir);
      }
      /**
       * @description
       * Retrieves the `FormGroup` for a provided `FormGroupName` directive instance
       *
       * @param dir The `FormGroupName` directive instance.
       */
      getFormGroup(dir) {
        return this.form.get(dir.path);
      }
      /**
       * Performs the necessary setup when a `FormArrayName` directive instance is added to the view.
       *
       * @param dir The `FormArrayName` directive instance.
       */
      addFormArray(dir) {
        this._setUpFormContainer(dir);
      }
      /**
       * Performs the necessary cleanup when a `FormArrayName` directive instance is removed from the
       * view.
       *
       * @param dir The `FormArrayName` directive instance.
       */
      removeFormArray(dir) {
        this._cleanUpFormContainer(dir);
      }
      /**
       * @description
       * Retrieves the `FormArray` for a provided `FormArrayName` directive instance.
       *
       * @param dir The `FormArrayName` directive instance.
       */
      getFormArray(dir) {
        return this.form.get(dir.path);
      }
      /**
       * Sets the new value for the provided `FormControlName` directive.
       *
       * @param dir The `FormControlName` directive instance.
       * @param value The new value for the directive's control.
       */
      updateModel(dir, value) {
        const ctrl = this.form.get(dir.path);
        ctrl.setValue(value);
      }
      /**
       * @description
       * Method called with the "submit" event is triggered on the form.
       * Triggers the `ngSubmit` emitter to emit the "submit" event as its payload.
       *
       * @param $event The "submit" event object
       */
      onSubmit($event) {
        this._submittedReactive.set(true);
        syncPendingControls(this.form, this.directives);
        this.ngSubmit.emit($event);
        this.form._events.next(new FormSubmittedEvent(this.control));
        return $event?.target?.method === "dialog";
      }
      /**
       * @description
       * Method called when the "reset" event is triggered on the form.
       */
      onReset() {
        this.resetForm();
      }
      /**
       * @description
       * Resets the form to an initial value and resets its submitted status.
       *
       * @param value The new value for the form, `undefined` by default
       */
      resetForm(value = void 0, options = {}) {
        this.form.reset(value, options);
        this._submittedReactive.set(false);
      }
      /** @internal */
      _updateDomValue() {
        this.directives.forEach((dir) => {
          const oldCtrl = dir.control;
          const newCtrl = this.form.get(dir.path);
          if (oldCtrl !== newCtrl) {
            cleanUpControl(oldCtrl || null, dir);
            if (isFormControl(newCtrl)) {
              setUpControl(newCtrl, dir, this.callSetDisabledState);
              dir.control = newCtrl;
            }
          }
        });
        this.form._updateTreeValidity({ emitEvent: false });
      }
      _setUpFormContainer(dir) {
        const ctrl = this.form.get(dir.path);
        setUpFormContainer(ctrl, dir);
        ctrl.updateValueAndValidity({ emitEvent: false });
      }
      _cleanUpFormContainer(dir) {
        if (this.form) {
          const ctrl = this.form.get(dir.path);
          if (ctrl) {
            const isControlUpdated = cleanUpFormContainer(ctrl, dir);
            if (isControlUpdated) {
              ctrl.updateValueAndValidity({ emitEvent: false });
            }
          }
        }
      }
      _updateRegistrations() {
        this.form._registerOnCollectionChange(this._onCollectionChange);
        if (this._oldForm) {
          this._oldForm._registerOnCollectionChange(() => {
          });
        }
      }
      _updateValidators() {
        setUpValidators(this.form, this);
        if (this._oldForm) {
          cleanUpValidators(this._oldForm, this);
        }
      }
      static \u0275fac = \u0275\u0275ngDeclareFactory({ minVersion: "12.0.0", version: "20.3.11", ngImport: core_exports, type: _FormGroupDirective, deps: [{ token: NG_VALIDATORS, optional: true, self: true }, { token: NG_ASYNC_VALIDATORS, optional: true, self: true }, { token: CALL_SET_DISABLED_STATE, optional: true }], target: FactoryTarget.Directive });
      static \u0275dir = \u0275\u0275ngDeclareDirective({ minVersion: "14.0.0", version: "20.3.11", type: _FormGroupDirective, isStandalone: false, selector: "[formGroup]", inputs: { form: ["formGroup", "form"] }, outputs: { ngSubmit: "ngSubmit" }, host: { listeners: { "submit": "onSubmit($event)", "reset": "onReset()" } }, providers: [formDirectiveProvider], exportAs: ["ngForm"], usesInheritance: true, usesOnChanges: true, ngImport: core_exports });
    };
    \u0275\u0275ngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.3.11", ngImport: core_exports, type: FormGroupDirective, decorators: [{
      type: Directive,
      args: [{
        selector: "[formGroup]",
        providers: [formDirectiveProvider],
        host: { "(submit)": "onSubmit($event)", "(reset)": "onReset()" },
        exportAs: "ngForm",
        standalone: false
      }]
    }], ctorParameters: () => [{ type: void 0, decorators: [{
      type: Optional
    }, {
      type: Self
    }, {
      type: Inject,
      args: [NG_VALIDATORS]
    }] }, { type: void 0, decorators: [{
      type: Optional
    }, {
      type: Self
    }, {
      type: Inject,
      args: [NG_ASYNC_VALIDATORS]
    }] }, { type: void 0, decorators: [{
      type: Optional
    }, {
      type: Inject,
      args: [CALL_SET_DISABLED_STATE]
    }] }], propDecorators: { form: [{
      type: Input,
      args: ["formGroup"]
    }], ngSubmit: [{
      type: Output
    }] } });
    formGroupNameProvider = {
      provide: ControlContainer,
      useExisting: forwardRef(() => FormGroupName)
    };
    FormGroupName = class _FormGroupName extends AbstractFormGroupDirective {
      /**
       * @description
       * Tracks the name of the `FormGroup` bound to the directive. The name corresponds
       * to a key in the parent `FormGroup` or `FormArray`.
       * Accepts a name as a string or a number.
       * The name in the form of a string is useful for individual forms,
       * while the numerical form allows for form groups to be bound
       * to indices when iterating over groups in a `FormArray`.
       */
      name = null;
      constructor(parent, validators, asyncValidators) {
        super();
        this._parent = parent;
        this._setValidators(validators);
        this._setAsyncValidators(asyncValidators);
      }
      /** @internal */
      _checkParentType() {
        if (hasInvalidParent(this._parent) && (typeof ngDevMode === "undefined" || ngDevMode)) {
          throw groupParentException();
        }
      }
      static \u0275fac = \u0275\u0275ngDeclareFactory({ minVersion: "12.0.0", version: "20.3.11", ngImport: core_exports, type: _FormGroupName, deps: [{ token: ControlContainer, host: true, optional: true, skipSelf: true }, { token: NG_VALIDATORS, optional: true, self: true }, { token: NG_ASYNC_VALIDATORS, optional: true, self: true }], target: FactoryTarget.Directive });
      static \u0275dir = \u0275\u0275ngDeclareDirective({ minVersion: "14.0.0", version: "20.3.11", type: _FormGroupName, isStandalone: false, selector: "[formGroupName]", inputs: { name: ["formGroupName", "name"] }, providers: [formGroupNameProvider], usesInheritance: true, ngImport: core_exports });
    };
    \u0275\u0275ngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.3.11", ngImport: core_exports, type: FormGroupName, decorators: [{
      type: Directive,
      args: [{
        selector: "[formGroupName]",
        providers: [formGroupNameProvider],
        standalone: false
      }]
    }], ctorParameters: () => [{ type: ControlContainer, decorators: [{
      type: Optional
    }, {
      type: Host
    }, {
      type: SkipSelf
    }] }, { type: void 0, decorators: [{
      type: Optional
    }, {
      type: Self
    }, {
      type: Inject,
      args: [NG_VALIDATORS]
    }] }, { type: void 0, decorators: [{
      type: Optional
    }, {
      type: Self
    }, {
      type: Inject,
      args: [NG_ASYNC_VALIDATORS]
    }] }], propDecorators: { name: [{
      type: Input,
      args: ["formGroupName"]
    }] } });
    formArrayNameProvider = {
      provide: ControlContainer,
      useExisting: forwardRef(() => FormArrayName)
    };
    FormArrayName = class _FormArrayName extends ControlContainer {
      /** @internal */
      _parent;
      /**
       * @description
       * Tracks the name of the `FormArray` bound to the directive. The name corresponds
       * to a key in the parent `FormGroup` or `FormArray`.
       * Accepts a name as a string or a number.
       * The name in the form of a string is useful for individual forms,
       * while the numerical form allows for form arrays to be bound
       * to indices when iterating over arrays in a `FormArray`.
       */
      name = null;
      constructor(parent, validators, asyncValidators) {
        super();
        this._parent = parent;
        this._setValidators(validators);
        this._setAsyncValidators(asyncValidators);
      }
      /**
       * A lifecycle method called when the directive's inputs are initialized. For internal use only.
       * @throws If the directive does not have a valid parent.
       * @docs-private
       */
      ngOnInit() {
        if (hasInvalidParent(this._parent) && (typeof ngDevMode === "undefined" || ngDevMode)) {
          throw arrayParentException();
        }
        this.formDirective.addFormArray(this);
      }
      /**
       * A lifecycle method called before the directive's instance is destroyed. For internal use only.
       * @docs-private
       */
      ngOnDestroy() {
        this.formDirective?.removeFormArray(this);
      }
      /**
       * @description
       * The `FormArray` bound to this directive.
       */
      get control() {
        return this.formDirective.getFormArray(this);
      }
      /**
       * @description
       * The top-level directive for this group if present, otherwise null.
       */
      get formDirective() {
        return this._parent ? this._parent.formDirective : null;
      }
      /**
       * @description
       * Returns an array that represents the path from the top-level form to this control.
       * Each index is the string name of the control on that level.
       */
      get path() {
        return controlPath(this.name == null ? this.name : this.name.toString(), this._parent);
      }
      static \u0275fac = \u0275\u0275ngDeclareFactory({ minVersion: "12.0.0", version: "20.3.11", ngImport: core_exports, type: _FormArrayName, deps: [{ token: ControlContainer, host: true, optional: true, skipSelf: true }, { token: NG_VALIDATORS, optional: true, self: true }, { token: NG_ASYNC_VALIDATORS, optional: true, self: true }], target: FactoryTarget.Directive });
      static \u0275dir = \u0275\u0275ngDeclareDirective({ minVersion: "14.0.0", version: "20.3.11", type: _FormArrayName, isStandalone: false, selector: "[formArrayName]", inputs: { name: ["formArrayName", "name"] }, providers: [formArrayNameProvider], usesInheritance: true, ngImport: core_exports });
    };
    \u0275\u0275ngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.3.11", ngImport: core_exports, type: FormArrayName, decorators: [{
      type: Directive,
      args: [{
        selector: "[formArrayName]",
        providers: [formArrayNameProvider],
        standalone: false
      }]
    }], ctorParameters: () => [{ type: ControlContainer, decorators: [{
      type: Optional
    }, {
      type: Host
    }, {
      type: SkipSelf
    }] }, { type: void 0, decorators: [{
      type: Optional
    }, {
      type: Self
    }, {
      type: Inject,
      args: [NG_VALIDATORS]
    }] }, { type: void 0, decorators: [{
      type: Optional
    }, {
      type: Self
    }, {
      type: Inject,
      args: [NG_ASYNC_VALIDATORS]
    }] }], propDecorators: { name: [{
      type: Input,
      args: ["formArrayName"]
    }] } });
    controlNameBinding = {
      provide: NgControl,
      useExisting: forwardRef(() => FormControlName)
    };
    FormControlName = class _FormControlName extends NgControl {
      _ngModelWarningConfig;
      _added = false;
      /**
       * Internal reference to the view model value.
       * @internal
       */
      viewModel;
      /**
       * @description
       * Tracks the `FormControl` instance bound to the directive.
       */
      control;
      /**
       * @description
       * Tracks the name of the `FormControl` bound to the directive. The name corresponds
       * to a key in the parent `FormGroup` or `FormArray`.
       * Accepts a name as a string or a number.
       * The name in the form of a string is useful for individual forms,
       * while the numerical form allows for form controls to be bound
       * to indices when iterating over controls in a `FormArray`.
       */
      name = null;
      /**
       * @description
       * Triggers a warning in dev mode that this input should not be used with reactive forms.
       */
      set isDisabled(isDisabled) {
        if (typeof ngDevMode === "undefined" || ngDevMode) {
          console.warn(disabledAttrWarning);
        }
      }
      // TODO(kara): remove next 4 properties once deprecation period is over
      /** @deprecated as of v6 */
      model;
      /** @deprecated as of v6 */
      update = new EventEmitter();
      /**
       * @description
       * Static property used to track whether any ngModel warnings have been sent across
       * all instances of FormControlName. Used to support warning config of "once".
       *
       * @internal
       */
      static _ngModelWarningSentOnce = false;
      /**
       * @description
       * Instance property used to track whether an ngModel warning has been sent out for this
       * particular FormControlName instance. Used to support warning config of "always".
       *
       * @internal
       */
      _ngModelWarningSent = false;
      constructor(parent, validators, asyncValidators, valueAccessors, _ngModelWarningConfig) {
        super();
        this._ngModelWarningConfig = _ngModelWarningConfig;
        this._parent = parent;
        this._setValidators(validators);
        this._setAsyncValidators(asyncValidators);
        this.valueAccessor = selectValueAccessor(this, valueAccessors);
      }
      /** @docs-private */
      ngOnChanges(changes) {
        if (!this._added)
          this._setUpControl();
        if (isPropertyUpdated(changes, this.viewModel)) {
          if (typeof ngDevMode === "undefined" || ngDevMode) {
            _ngModelWarning("formControlName", _FormControlName, this, this._ngModelWarningConfig);
          }
          this.viewModel = this.model;
          this.formDirective.updateModel(this, this.model);
        }
      }
      /** @docs-private */
      ngOnDestroy() {
        if (this.formDirective) {
          this.formDirective.removeControl(this);
        }
      }
      /**
       * @description
       * Sets the new value for the view model and emits an `ngModelChange` event.
       *
       * @param newValue The new value for the view model.
       */
      viewToModelUpdate(newValue) {
        this.viewModel = newValue;
        this.update.emit(newValue);
      }
      /**
       * @description
       * Returns an array that represents the path from the top-level form to this control.
       * Each index is the string name of the control on that level.
       */
      get path() {
        return controlPath(this.name == null ? this.name : this.name.toString(), this._parent);
      }
      /**
       * @description
       * The top-level directive for this group if present, otherwise null.
       */
      get formDirective() {
        return this._parent ? this._parent.formDirective : null;
      }
      _setUpControl() {
        if (typeof ngDevMode === "undefined" || ngDevMode) {
          checkParentType(this._parent, this.name);
        }
        this.control = this.formDirective.addControl(this);
        this._added = true;
      }
      static \u0275fac = \u0275\u0275ngDeclareFactory({ minVersion: "12.0.0", version: "20.3.11", ngImport: core_exports, type: _FormControlName, deps: [{ token: ControlContainer, host: true, optional: true, skipSelf: true }, { token: NG_VALIDATORS, optional: true, self: true }, { token: NG_ASYNC_VALIDATORS, optional: true, self: true }, { token: NG_VALUE_ACCESSOR, optional: true, self: true }, { token: NG_MODEL_WITH_FORM_CONTROL_WARNING, optional: true }], target: FactoryTarget.Directive });
      static \u0275dir = \u0275\u0275ngDeclareDirective({ minVersion: "14.0.0", version: "20.3.11", type: _FormControlName, isStandalone: false, selector: "[formControlName]", inputs: { name: ["formControlName", "name"], isDisabled: ["disabled", "isDisabled"], model: ["ngModel", "model"] }, outputs: { update: "ngModelChange" }, providers: [controlNameBinding], usesInheritance: true, usesOnChanges: true, ngImport: core_exports });
    };
    \u0275\u0275ngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.3.11", ngImport: core_exports, type: FormControlName, decorators: [{
      type: Directive,
      args: [{
        selector: "[formControlName]",
        providers: [controlNameBinding],
        standalone: false
      }]
    }], ctorParameters: () => [{ type: ControlContainer, decorators: [{
      type: Optional
    }, {
      type: Host
    }, {
      type: SkipSelf
    }] }, { type: void 0, decorators: [{
      type: Optional
    }, {
      type: Self
    }, {
      type: Inject,
      args: [NG_VALIDATORS]
    }] }, { type: void 0, decorators: [{
      type: Optional
    }, {
      type: Self
    }, {
      type: Inject,
      args: [NG_ASYNC_VALIDATORS]
    }] }, { type: void 0, decorators: [{
      type: Optional
    }, {
      type: Self
    }, {
      type: Inject,
      args: [NG_VALUE_ACCESSOR]
    }] }, { type: void 0, decorators: [{
      type: Optional
    }, {
      type: Inject,
      args: [NG_MODEL_WITH_FORM_CONTROL_WARNING]
    }] }], propDecorators: { name: [{
      type: Input,
      args: ["formControlName"]
    }], isDisabled: [{
      type: Input,
      args: ["disabled"]
    }], model: [{
      type: Input,
      args: ["ngModel"]
    }], update: [{
      type: Output,
      args: ["ngModelChange"]
    }] } });
    SELECT_VALUE_ACCESSOR = {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectControlValueAccessor),
      multi: true
    };
    SelectControlValueAccessor = class _SelectControlValueAccessor extends BuiltInControlValueAccessor {
      /** @docs-private */
      value;
      /** @internal */
      _optionMap = /* @__PURE__ */ new Map();
      /** @internal */
      _idCounter = 0;
      /**
       * @description
       * Tracks the option comparison algorithm for tracking identities when
       * checking for changes.
       */
      set compareWith(fn) {
        if (typeof fn !== "function" && (typeof ngDevMode === "undefined" || ngDevMode)) {
          throw new RuntimeError(1201, `compareWith must be a function, but received ${JSON.stringify(fn)}`);
        }
        this._compareWith = fn;
      }
      _compareWith = Object.is;
      // We need this because we might be in the process of destroying the root
      // injector, which is marked as destroyed before running destroy hooks.
      // Attempting to use afterNextRender with the node injector would evntually
      // run into that already destroyed injector.
      appRefInjector = inject(ApplicationRef).injector;
      destroyRef = inject(DestroyRef);
      cdr = inject(ChangeDetectorRef);
      _queuedWrite = false;
      /**
       * This is needed to efficiently set the select value when adding/removing options. If
       * writeValue is instead called for every added/removed option, this results in exponentially
       * more _compareValue calls than the number of option elements (issue #41330).
       *
       * Secondly, calling writeValue when rendering individual option elements instead of after they
       * are all rendered caused an issue in Safari and IE 11 where the first option element failed
       * to be deselected when no option matched the select ngModel. This was because Angular would
       * set the select element's value property before appending the option's child text node to the
       * DOM (issue #14505).
       *
       * Finally, this approach is necessary to avoid an issue with delayed element removal when
       * using the animations module (in all browsers). Otherwise when a selected option is removed
       * (so no option matches the ngModel anymore), Angular would change the select element value
       * before actually removing the option from the DOM. Then when the option is finally removed
       * from the DOM, the browser would change the select value to that of the first option, even
       * though it doesn't match the ngModel (issue #18430).
       *
       * @internal
       */
      _writeValueAfterRender() {
        if (this._queuedWrite || this.appRefInjector.destroyed) {
          return;
        }
        this._queuedWrite = true;
        afterNextRender({
          write: () => {
            if (this.destroyRef.destroyed) {
              return;
            }
            this._queuedWrite = false;
            this.writeValue(this.value);
          }
        }, { injector: this.appRefInjector });
      }
      /**
       * Sets the "value" property on the select element.
       * @docs-private
       */
      writeValue(value) {
        this.cdr.markForCheck();
        this.value = value;
        const id = this._getOptionId(value);
        const valueString = _buildValueString$1(id, value);
        this.setProperty("value", valueString);
      }
      /**
       * Registers a function called when the control value changes.
       * @docs-private
       */
      registerOnChange(fn) {
        this.onChange = (valueString) => {
          this.value = this._getOptionValue(valueString);
          fn(this.value);
        };
      }
      /** @internal */
      _registerOption() {
        return (this._idCounter++).toString();
      }
      /** @internal */
      _getOptionId(value) {
        for (const id of this._optionMap.keys()) {
          if (this._compareWith(this._optionMap.get(id), value))
            return id;
        }
        return null;
      }
      /** @internal */
      _getOptionValue(valueString) {
        const id = _extractId$1(valueString);
        return this._optionMap.has(id) ? this._optionMap.get(id) : valueString;
      }
      static \u0275fac = \u0275\u0275ngDeclareFactory({ minVersion: "12.0.0", version: "20.3.11", ngImport: core_exports, type: _SelectControlValueAccessor, deps: null, target: FactoryTarget.Directive });
      static \u0275dir = \u0275\u0275ngDeclareDirective({ minVersion: "14.0.0", version: "20.3.11", type: _SelectControlValueAccessor, isStandalone: false, selector: "select:not([multiple])[formControlName],select:not([multiple])[formControl],select:not([multiple])[ngModel]", inputs: { compareWith: "compareWith" }, host: { listeners: { "change": "onChange($any($event.target).value)", "blur": "onTouched()" } }, providers: [SELECT_VALUE_ACCESSOR], usesInheritance: true, ngImport: core_exports });
    };
    \u0275\u0275ngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.3.11", ngImport: core_exports, type: SelectControlValueAccessor, decorators: [{
      type: Directive,
      args: [{
        selector: "select:not([multiple])[formControlName],select:not([multiple])[formControl],select:not([multiple])[ngModel]",
        host: { "(change)": "onChange($any($event.target).value)", "(blur)": "onTouched()" },
        providers: [SELECT_VALUE_ACCESSOR],
        standalone: false
      }]
    }], propDecorators: { compareWith: [{
      type: Input
    }] } });
    NgSelectOption = class _NgSelectOption {
      _element;
      _renderer;
      _select;
      /**
       * @description
       * ID of the option element
       */
      id;
      constructor(_element, _renderer, _select) {
        this._element = _element;
        this._renderer = _renderer;
        this._select = _select;
        if (this._select)
          this.id = this._select._registerOption();
      }
      /**
       * @description
       * Tracks the value bound to the option element. Unlike the value binding,
       * ngValue supports binding to objects.
       */
      set ngValue(value) {
        if (this._select == null)
          return;
        this._select._optionMap.set(this.id, value);
        this._setElementValue(_buildValueString$1(this.id, value));
        this._select._writeValueAfterRender();
      }
      /**
       * @description
       * Tracks simple string values bound to the option element.
       * For objects, use the `ngValue` input binding.
       */
      set value(value) {
        this._setElementValue(value);
        if (this._select)
          this._select._writeValueAfterRender();
      }
      /** @internal */
      _setElementValue(value) {
        this._renderer.setProperty(this._element.nativeElement, "value", value);
      }
      /** @docs-private */
      ngOnDestroy() {
        if (this._select) {
          this._select._optionMap.delete(this.id);
          this._select._writeValueAfterRender();
        }
      }
      static \u0275fac = \u0275\u0275ngDeclareFactory({ minVersion: "12.0.0", version: "20.3.11", ngImport: core_exports, type: _NgSelectOption, deps: [{ token: ElementRef }, { token: Renderer2 }, { token: SelectControlValueAccessor, host: true, optional: true }], target: FactoryTarget.Directive });
      static \u0275dir = \u0275\u0275ngDeclareDirective({ minVersion: "14.0.0", version: "20.3.11", type: _NgSelectOption, isStandalone: false, selector: "option", inputs: { ngValue: "ngValue", value: "value" }, ngImport: core_exports });
    };
    \u0275\u0275ngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.3.11", ngImport: core_exports, type: NgSelectOption, decorators: [{
      type: Directive,
      args: [{
        selector: "option",
        standalone: false
      }]
    }], ctorParameters: () => [{ type: ElementRef }, { type: Renderer2 }, { type: SelectControlValueAccessor, decorators: [{
      type: Optional
    }, {
      type: Host
    }] }], propDecorators: { ngValue: [{
      type: Input,
      args: ["ngValue"]
    }], value: [{
      type: Input,
      args: ["value"]
    }] } });
    SELECT_MULTIPLE_VALUE_ACCESSOR = {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectMultipleControlValueAccessor),
      multi: true
    };
    SelectMultipleControlValueAccessor = class _SelectMultipleControlValueAccessor extends BuiltInControlValueAccessor {
      /**
       * The current value.
       * @docs-private
       */
      value;
      /** @internal */
      _optionMap = /* @__PURE__ */ new Map();
      /** @internal */
      _idCounter = 0;
      /**
       * @description
       * Tracks the option comparison algorithm for tracking identities when
       * checking for changes.
       */
      set compareWith(fn) {
        if (typeof fn !== "function" && (typeof ngDevMode === "undefined" || ngDevMode)) {
          throw new RuntimeError(1201, `compareWith must be a function, but received ${JSON.stringify(fn)}`);
        }
        this._compareWith = fn;
      }
      _compareWith = Object.is;
      /**
       * Sets the "value" property on one or of more of the select's options.
       * @docs-private
       */
      writeValue(value) {
        this.value = value;
        let optionSelectedStateSetter;
        if (Array.isArray(value)) {
          const ids = value.map((v) => this._getOptionId(v));
          optionSelectedStateSetter = (opt, o) => {
            opt._setSelected(ids.indexOf(o.toString()) > -1);
          };
        } else {
          optionSelectedStateSetter = (opt, o) => {
            opt._setSelected(false);
          };
        }
        this._optionMap.forEach(optionSelectedStateSetter);
      }
      /**
       * Registers a function called when the control value changes
       * and writes an array of the selected options.
       * @docs-private
       */
      registerOnChange(fn) {
        this.onChange = (element) => {
          const selected = [];
          const selectedOptions = element.selectedOptions;
          if (selectedOptions !== void 0) {
            const options = selectedOptions;
            for (let i = 0; i < options.length; i++) {
              const opt = options[i];
              const val = this._getOptionValue(opt.value);
              selected.push(val);
            }
          } else {
            const options = element.options;
            for (let i = 0; i < options.length; i++) {
              const opt = options[i];
              if (opt.selected) {
                const val = this._getOptionValue(opt.value);
                selected.push(val);
              }
            }
          }
          this.value = selected;
          fn(selected);
        };
      }
      /** @internal */
      _registerOption(value) {
        const id = (this._idCounter++).toString();
        this._optionMap.set(id, value);
        return id;
      }
      /** @internal */
      _getOptionId(value) {
        for (const id of this._optionMap.keys()) {
          if (this._compareWith(this._optionMap.get(id)._value, value))
            return id;
        }
        return null;
      }
      /** @internal */
      _getOptionValue(valueString) {
        const id = _extractId(valueString);
        return this._optionMap.has(id) ? this._optionMap.get(id)._value : valueString;
      }
      static \u0275fac = \u0275\u0275ngDeclareFactory({ minVersion: "12.0.0", version: "20.3.11", ngImport: core_exports, type: _SelectMultipleControlValueAccessor, deps: null, target: FactoryTarget.Directive });
      static \u0275dir = \u0275\u0275ngDeclareDirective({ minVersion: "14.0.0", version: "20.3.11", type: _SelectMultipleControlValueAccessor, isStandalone: false, selector: "select[multiple][formControlName],select[multiple][formControl],select[multiple][ngModel]", inputs: { compareWith: "compareWith" }, host: { listeners: { "change": "onChange($event.target)", "blur": "onTouched()" } }, providers: [SELECT_MULTIPLE_VALUE_ACCESSOR], usesInheritance: true, ngImport: core_exports });
    };
    \u0275\u0275ngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.3.11", ngImport: core_exports, type: SelectMultipleControlValueAccessor, decorators: [{
      type: Directive,
      args: [{
        selector: "select[multiple][formControlName],select[multiple][formControl],select[multiple][ngModel]",
        host: { "(change)": "onChange($event.target)", "(blur)": "onTouched()" },
        providers: [SELECT_MULTIPLE_VALUE_ACCESSOR],
        standalone: false
      }]
    }], propDecorators: { compareWith: [{
      type: Input
    }] } });
    \u0275NgSelectMultipleOption = class _\u0275NgSelectMultipleOption {
      _element;
      _renderer;
      _select;
      id;
      /** @internal */
      _value;
      constructor(_element, _renderer, _select) {
        this._element = _element;
        this._renderer = _renderer;
        this._select = _select;
        if (this._select) {
          this.id = this._select._registerOption(this);
        }
      }
      /**
       * @description
       * Tracks the value bound to the option element. Unlike the value binding,
       * ngValue supports binding to objects.
       */
      set ngValue(value) {
        if (this._select == null)
          return;
        this._value = value;
        this._setElementValue(_buildValueString(this.id, value));
        this._select.writeValue(this._select.value);
      }
      /**
       * @description
       * Tracks simple string values bound to the option element.
       * For objects, use the `ngValue` input binding.
       */
      set value(value) {
        if (this._select) {
          this._value = value;
          this._setElementValue(_buildValueString(this.id, value));
          this._select.writeValue(this._select.value);
        } else {
          this._setElementValue(value);
        }
      }
      /** @internal */
      _setElementValue(value) {
        this._renderer.setProperty(this._element.nativeElement, "value", value);
      }
      /** @internal */
      _setSelected(selected) {
        this._renderer.setProperty(this._element.nativeElement, "selected", selected);
      }
      /** @docs-private */
      ngOnDestroy() {
        if (this._select) {
          this._select._optionMap.delete(this.id);
          this._select.writeValue(this._select.value);
        }
      }
      static \u0275fac = \u0275\u0275ngDeclareFactory({ minVersion: "12.0.0", version: "20.3.11", ngImport: core_exports, type: _\u0275NgSelectMultipleOption, deps: [{ token: ElementRef }, { token: Renderer2 }, { token: SelectMultipleControlValueAccessor, host: true, optional: true }], target: FactoryTarget.Directive });
      static \u0275dir = \u0275\u0275ngDeclareDirective({ minVersion: "14.0.0", version: "20.3.11", type: _\u0275NgSelectMultipleOption, isStandalone: false, selector: "option", inputs: { ngValue: "ngValue", value: "value" }, ngImport: core_exports });
    };
    \u0275\u0275ngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.3.11", ngImport: core_exports, type: \u0275NgSelectMultipleOption, decorators: [{
      type: Directive,
      args: [{
        selector: "option",
        standalone: false
      }]
    }], ctorParameters: () => [{ type: ElementRef }, { type: Renderer2 }, { type: SelectMultipleControlValueAccessor, decorators: [{
      type: Optional
    }, {
      type: Host
    }] }], propDecorators: { ngValue: [{
      type: Input,
      args: ["ngValue"]
    }], value: [{
      type: Input,
      args: ["value"]
    }] } });
    AbstractValidatorDirective = class _AbstractValidatorDirective {
      _validator = nullValidator;
      _onChange;
      /**
       * A flag that tracks whether this validator is enabled.
       *
       * Marking it `internal` (vs `protected`), so that this flag can be used in host bindings of
       * directive classes that extend this base class.
       * @internal
       */
      _enabled;
      /** @docs-private */
      ngOnChanges(changes) {
        if (this.inputName in changes) {
          const input = this.normalizeInput(changes[this.inputName].currentValue);
          this._enabled = this.enabled(input);
          this._validator = this._enabled ? this.createValidator(input) : nullValidator;
          if (this._onChange) {
            this._onChange();
          }
        }
      }
      /** @docs-private */
      validate(control) {
        return this._validator(control);
      }
      /** @docs-private */
      registerOnValidatorChange(fn) {
        this._onChange = fn;
      }
      /**
       * @description
       * Determines whether this validator should be active or not based on an input.
       * Base class implementation checks whether an input is defined (if the value is different from
       * `null` and `undefined`). Validator classes that extend this base class can override this
       * function with the logic specific to a particular validator directive.
       */
      enabled(input) {
        return input != null;
      }
      static \u0275fac = \u0275\u0275ngDeclareFactory({ minVersion: "12.0.0", version: "20.3.11", ngImport: core_exports, type: _AbstractValidatorDirective, deps: [], target: FactoryTarget.Directive });
      static \u0275dir = \u0275\u0275ngDeclareDirective({ minVersion: "14.0.0", version: "20.3.11", type: _AbstractValidatorDirective, isStandalone: true, usesOnChanges: true, ngImport: core_exports });
    };
    \u0275\u0275ngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.3.11", ngImport: core_exports, type: AbstractValidatorDirective, decorators: [{
      type: Directive
    }] });
    MAX_VALIDATOR = {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => MaxValidator),
      multi: true
    };
    MaxValidator = class _MaxValidator extends AbstractValidatorDirective {
      /**
       * @description
       * Tracks changes to the max bound to this directive.
       */
      max;
      /** @internal */
      inputName = "max";
      /** @internal */
      normalizeInput = (input) => toFloat(input);
      /** @internal */
      createValidator = (max) => maxValidator(max);
      static \u0275fac = \u0275\u0275ngDeclareFactory({ minVersion: "12.0.0", version: "20.3.11", ngImport: core_exports, type: _MaxValidator, deps: null, target: FactoryTarget.Directive });
      static \u0275dir = \u0275\u0275ngDeclareDirective({ minVersion: "14.0.0", version: "20.3.11", type: _MaxValidator, isStandalone: false, selector: "input[type=number][max][formControlName],input[type=number][max][formControl],input[type=number][max][ngModel]", inputs: { max: "max" }, host: { properties: { "attr.max": "_enabled ? max : null" } }, providers: [MAX_VALIDATOR], usesInheritance: true, ngImport: core_exports });
    };
    \u0275\u0275ngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.3.11", ngImport: core_exports, type: MaxValidator, decorators: [{
      type: Directive,
      args: [{
        selector: "input[type=number][max][formControlName],input[type=number][max][formControl],input[type=number][max][ngModel]",
        providers: [MAX_VALIDATOR],
        host: { "[attr.max]": "_enabled ? max : null" },
        standalone: false
      }]
    }], propDecorators: { max: [{
      type: Input
    }] } });
    MIN_VALIDATOR = {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => MinValidator),
      multi: true
    };
    MinValidator = class _MinValidator extends AbstractValidatorDirective {
      /**
       * @description
       * Tracks changes to the min bound to this directive.
       */
      min;
      /** @internal */
      inputName = "min";
      /** @internal */
      normalizeInput = (input) => toFloat(input);
      /** @internal */
      createValidator = (min) => minValidator(min);
      static \u0275fac = \u0275\u0275ngDeclareFactory({ minVersion: "12.0.0", version: "20.3.11", ngImport: core_exports, type: _MinValidator, deps: null, target: FactoryTarget.Directive });
      static \u0275dir = \u0275\u0275ngDeclareDirective({ minVersion: "14.0.0", version: "20.3.11", type: _MinValidator, isStandalone: false, selector: "input[type=number][min][formControlName],input[type=number][min][formControl],input[type=number][min][ngModel]", inputs: { min: "min" }, host: { properties: { "attr.min": "_enabled ? min : null" } }, providers: [MIN_VALIDATOR], usesInheritance: true, ngImport: core_exports });
    };
    \u0275\u0275ngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.3.11", ngImport: core_exports, type: MinValidator, decorators: [{
      type: Directive,
      args: [{
        selector: "input[type=number][min][formControlName],input[type=number][min][formControl],input[type=number][min][ngModel]",
        providers: [MIN_VALIDATOR],
        host: { "[attr.min]": "_enabled ? min : null" },
        standalone: false
      }]
    }], propDecorators: { min: [{
      type: Input
    }] } });
    REQUIRED_VALIDATOR = {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => RequiredValidator),
      multi: true
    };
    CHECKBOX_REQUIRED_VALIDATOR = {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => CheckboxRequiredValidator),
      multi: true
    };
    RequiredValidator = class _RequiredValidator extends AbstractValidatorDirective {
      /**
       * @description
       * Tracks changes to the required attribute bound to this directive.
       */
      required;
      /** @internal */
      inputName = "required";
      /** @internal */
      normalizeInput = booleanAttribute;
      /** @internal */
      createValidator = (input) => requiredValidator;
      /** @docs-private */
      enabled(input) {
        return input;
      }
      static \u0275fac = \u0275\u0275ngDeclareFactory({ minVersion: "12.0.0", version: "20.3.11", ngImport: core_exports, type: _RequiredValidator, deps: null, target: FactoryTarget.Directive });
      static \u0275dir = \u0275\u0275ngDeclareDirective({ minVersion: "14.0.0", version: "20.3.11", type: _RequiredValidator, isStandalone: false, selector: ":not([type=checkbox])[required][formControlName],:not([type=checkbox])[required][formControl],:not([type=checkbox])[required][ngModel]", inputs: { required: "required" }, host: { properties: { "attr.required": '_enabled ? "" : null' } }, providers: [REQUIRED_VALIDATOR], usesInheritance: true, ngImport: core_exports });
    };
    \u0275\u0275ngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.3.11", ngImport: core_exports, type: RequiredValidator, decorators: [{
      type: Directive,
      args: [{
        selector: ":not([type=checkbox])[required][formControlName],:not([type=checkbox])[required][formControl],:not([type=checkbox])[required][ngModel]",
        providers: [REQUIRED_VALIDATOR],
        host: { "[attr.required]": '_enabled ? "" : null' },
        standalone: false
      }]
    }], propDecorators: { required: [{
      type: Input
    }] } });
    CheckboxRequiredValidator = class _CheckboxRequiredValidator extends RequiredValidator {
      /** @internal */
      createValidator = (input) => requiredTrueValidator;
      static \u0275fac = \u0275\u0275ngDeclareFactory({ minVersion: "12.0.0", version: "20.3.11", ngImport: core_exports, type: _CheckboxRequiredValidator, deps: null, target: FactoryTarget.Directive });
      static \u0275dir = \u0275\u0275ngDeclareDirective({ minVersion: "14.0.0", version: "20.3.11", type: _CheckboxRequiredValidator, isStandalone: false, selector: "input[type=checkbox][required][formControlName],input[type=checkbox][required][formControl],input[type=checkbox][required][ngModel]", host: { properties: { "attr.required": '_enabled ? "" : null' } }, providers: [CHECKBOX_REQUIRED_VALIDATOR], usesInheritance: true, ngImport: core_exports });
    };
    \u0275\u0275ngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.3.11", ngImport: core_exports, type: CheckboxRequiredValidator, decorators: [{
      type: Directive,
      args: [{
        selector: "input[type=checkbox][required][formControlName],input[type=checkbox][required][formControl],input[type=checkbox][required][ngModel]",
        providers: [CHECKBOX_REQUIRED_VALIDATOR],
        host: { "[attr.required]": '_enabled ? "" : null' },
        standalone: false
      }]
    }] });
    EMAIL_VALIDATOR = {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => EmailValidator),
      multi: true
    };
    EmailValidator = class _EmailValidator extends AbstractValidatorDirective {
      /**
       * @description
       * Tracks changes to the email attribute bound to this directive.
       */
      email;
      /** @internal */
      inputName = "email";
      /** @internal */
      normalizeInput = booleanAttribute;
      /** @internal */
      createValidator = (input) => emailValidator;
      /** @docs-private */
      enabled(input) {
        return input;
      }
      static \u0275fac = \u0275\u0275ngDeclareFactory({ minVersion: "12.0.0", version: "20.3.11", ngImport: core_exports, type: _EmailValidator, deps: null, target: FactoryTarget.Directive });
      static \u0275dir = \u0275\u0275ngDeclareDirective({ minVersion: "14.0.0", version: "20.3.11", type: _EmailValidator, isStandalone: false, selector: "[email][formControlName],[email][formControl],[email][ngModel]", inputs: { email: "email" }, providers: [EMAIL_VALIDATOR], usesInheritance: true, ngImport: core_exports });
    };
    \u0275\u0275ngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.3.11", ngImport: core_exports, type: EmailValidator, decorators: [{
      type: Directive,
      args: [{
        selector: "[email][formControlName],[email][formControl],[email][ngModel]",
        providers: [EMAIL_VALIDATOR],
        standalone: false
      }]
    }], propDecorators: { email: [{
      type: Input
    }] } });
    MIN_LENGTH_VALIDATOR = {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => MinLengthValidator),
      multi: true
    };
    MinLengthValidator = class _MinLengthValidator extends AbstractValidatorDirective {
      /**
       * @description
       * Tracks changes to the minimum length bound to this directive.
       */
      minlength;
      /** @internal */
      inputName = "minlength";
      /** @internal */
      normalizeInput = (input) => toInteger(input);
      /** @internal */
      createValidator = (minlength) => minLengthValidator(minlength);
      static \u0275fac = \u0275\u0275ngDeclareFactory({ minVersion: "12.0.0", version: "20.3.11", ngImport: core_exports, type: _MinLengthValidator, deps: null, target: FactoryTarget.Directive });
      static \u0275dir = \u0275\u0275ngDeclareDirective({ minVersion: "14.0.0", version: "20.3.11", type: _MinLengthValidator, isStandalone: false, selector: "[minlength][formControlName],[minlength][formControl],[minlength][ngModel]", inputs: { minlength: "minlength" }, host: { properties: { "attr.minlength": "_enabled ? minlength : null" } }, providers: [MIN_LENGTH_VALIDATOR], usesInheritance: true, ngImport: core_exports });
    };
    \u0275\u0275ngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.3.11", ngImport: core_exports, type: MinLengthValidator, decorators: [{
      type: Directive,
      args: [{
        selector: "[minlength][formControlName],[minlength][formControl],[minlength][ngModel]",
        providers: [MIN_LENGTH_VALIDATOR],
        host: { "[attr.minlength]": "_enabled ? minlength : null" },
        standalone: false
      }]
    }], propDecorators: { minlength: [{
      type: Input
    }] } });
    MAX_LENGTH_VALIDATOR = {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => MaxLengthValidator),
      multi: true
    };
    MaxLengthValidator = class _MaxLengthValidator extends AbstractValidatorDirective {
      /**
       * @description
       * Tracks changes to the maximum length bound to this directive.
       */
      maxlength;
      /** @internal */
      inputName = "maxlength";
      /** @internal */
      normalizeInput = (input) => toInteger(input);
      /** @internal */
      createValidator = (maxlength) => maxLengthValidator(maxlength);
      static \u0275fac = \u0275\u0275ngDeclareFactory({ minVersion: "12.0.0", version: "20.3.11", ngImport: core_exports, type: _MaxLengthValidator, deps: null, target: FactoryTarget.Directive });
      static \u0275dir = \u0275\u0275ngDeclareDirective({ minVersion: "14.0.0", version: "20.3.11", type: _MaxLengthValidator, isStandalone: false, selector: "[maxlength][formControlName],[maxlength][formControl],[maxlength][ngModel]", inputs: { maxlength: "maxlength" }, host: { properties: { "attr.maxlength": "_enabled ? maxlength : null" } }, providers: [MAX_LENGTH_VALIDATOR], usesInheritance: true, ngImport: core_exports });
    };
    \u0275\u0275ngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.3.11", ngImport: core_exports, type: MaxLengthValidator, decorators: [{
      type: Directive,
      args: [{
        selector: "[maxlength][formControlName],[maxlength][formControl],[maxlength][ngModel]",
        providers: [MAX_LENGTH_VALIDATOR],
        host: { "[attr.maxlength]": "_enabled ? maxlength : null" },
        standalone: false
      }]
    }], propDecorators: { maxlength: [{
      type: Input
    }] } });
    PATTERN_VALIDATOR = {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => PatternValidator),
      multi: true
    };
    PatternValidator = class _PatternValidator extends AbstractValidatorDirective {
      /**
       * @description
       * Tracks changes to the pattern bound to this directive.
       */
      pattern;
      // This input is always defined, since the name matches selector.
      /** @internal */
      inputName = "pattern";
      /** @internal */
      normalizeInput = (input) => input;
      /** @internal */
      createValidator = (input) => patternValidator(input);
      static \u0275fac = \u0275\u0275ngDeclareFactory({ minVersion: "12.0.0", version: "20.3.11", ngImport: core_exports, type: _PatternValidator, deps: null, target: FactoryTarget.Directive });
      static \u0275dir = \u0275\u0275ngDeclareDirective({ minVersion: "14.0.0", version: "20.3.11", type: _PatternValidator, isStandalone: false, selector: "[pattern][formControlName],[pattern][formControl],[pattern][ngModel]", inputs: { pattern: "pattern" }, host: { properties: { "attr.pattern": "_enabled ? pattern : null" } }, providers: [PATTERN_VALIDATOR], usesInheritance: true, ngImport: core_exports });
    };
    \u0275\u0275ngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.3.11", ngImport: core_exports, type: PatternValidator, decorators: [{
      type: Directive,
      args: [{
        selector: "[pattern][formControlName],[pattern][formControl],[pattern][ngModel]",
        providers: [PATTERN_VALIDATOR],
        host: { "[attr.pattern]": "_enabled ? pattern : null" },
        standalone: false
      }]
    }], propDecorators: { pattern: [{
      type: Input
    }] } });
    SHARED_FORM_DIRECTIVES = [
      \u0275NgNoValidate,
      NgSelectOption,
      \u0275NgSelectMultipleOption,
      DefaultValueAccessor,
      NumberValueAccessor,
      RangeValueAccessor,
      CheckboxControlValueAccessor,
      SelectControlValueAccessor,
      SelectMultipleControlValueAccessor,
      RadioControlValueAccessor,
      NgControlStatus,
      NgControlStatusGroup,
      RequiredValidator,
      MinLengthValidator,
      MaxLengthValidator,
      PatternValidator,
      CheckboxRequiredValidator,
      EmailValidator,
      MinValidator,
      MaxValidator
    ];
    TEMPLATE_DRIVEN_DIRECTIVES = [NgModel, NgModelGroup, NgForm];
    REACTIVE_DRIVEN_DIRECTIVES = [
      FormControlDirective,
      FormGroupDirective,
      FormControlName,
      FormGroupName,
      FormArrayName
    ];
    \u0275InternalFormsSharedModule = class _\u0275InternalFormsSharedModule {
      static \u0275fac = \u0275\u0275ngDeclareFactory({ minVersion: "12.0.0", version: "20.3.11", ngImport: core_exports, type: _\u0275InternalFormsSharedModule, deps: [], target: FactoryTarget.NgModule });
      static \u0275mod = \u0275\u0275ngDeclareNgModule({ minVersion: "14.0.0", version: "20.3.11", ngImport: core_exports, type: _\u0275InternalFormsSharedModule, declarations: [
        \u0275NgNoValidate,
        NgSelectOption,
        \u0275NgSelectMultipleOption,
        DefaultValueAccessor,
        NumberValueAccessor,
        RangeValueAccessor,
        CheckboxControlValueAccessor,
        SelectControlValueAccessor,
        SelectMultipleControlValueAccessor,
        RadioControlValueAccessor,
        NgControlStatus,
        NgControlStatusGroup,
        RequiredValidator,
        MinLengthValidator,
        MaxLengthValidator,
        PatternValidator,
        CheckboxRequiredValidator,
        EmailValidator,
        MinValidator,
        MaxValidator
      ], exports: [
        \u0275NgNoValidate,
        NgSelectOption,
        \u0275NgSelectMultipleOption,
        DefaultValueAccessor,
        NumberValueAccessor,
        RangeValueAccessor,
        CheckboxControlValueAccessor,
        SelectControlValueAccessor,
        SelectMultipleControlValueAccessor,
        RadioControlValueAccessor,
        NgControlStatus,
        NgControlStatusGroup,
        RequiredValidator,
        MinLengthValidator,
        MaxLengthValidator,
        PatternValidator,
        CheckboxRequiredValidator,
        EmailValidator,
        MinValidator,
        MaxValidator
      ] });
      static \u0275inj = \u0275\u0275ngDeclareInjector({ minVersion: "12.0.0", version: "20.3.11", ngImport: core_exports, type: _\u0275InternalFormsSharedModule });
    };
    \u0275\u0275ngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.3.11", ngImport: core_exports, type: \u0275InternalFormsSharedModule, decorators: [{
      type: NgModule,
      args: [{
        declarations: SHARED_FORM_DIRECTIVES,
        exports: SHARED_FORM_DIRECTIVES
      }]
    }] });
    FormArray = class extends AbstractControl {
      /**
       * Creates a new `FormArray` instance.
       *
       * @param controls An array of child controls. Each child control is given an index
       * where it is registered.
       *
       * @param validatorOrOpts A synchronous validator function, or an array of
       * such functions, or an `AbstractControlOptions` object that contains validation functions
       * and a validation trigger.
       *
       * @param asyncValidator A single async validator or array of async validator functions
       *
       */
      constructor(controls, validatorOrOpts, asyncValidator) {
        super(pickValidators(validatorOrOpts), pickAsyncValidators(asyncValidator, validatorOrOpts));
        this.controls = controls;
        this._initObservables();
        this._setUpdateStrategy(validatorOrOpts);
        this._setUpControls();
        this.updateValueAndValidity({
          onlySelf: true,
          // If `asyncValidator` is present, it will trigger control status change from `PENDING` to
          // `VALID` or `INVALID`.
          // The status should be broadcasted via the `statusChanges` observable, so we set `emitEvent`
          // to `true` to allow that during the control creation process.
          emitEvent: !!this.asyncValidator
        });
      }
      controls;
      /**
       * Get the `AbstractControl` at the given `index` in the array.
       *
       * @param index Index in the array to retrieve the control. If `index` is negative, it will wrap
       *     around from the back, and if index is greatly negative (less than `-length`), the result is
       * undefined. This behavior is the same as `Array.at(index)`.
       */
      at(index) {
        return this.controls[this._adjustIndex(index)];
      }
      /**
       * Insert a new `AbstractControl` at the end of the array.
       *
       * @param control Form control to be inserted
       * @param options Specifies whether this FormArray instance should emit events after a new
       *     control is added.
       * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
       * `valueChanges` observables emit events with the latest status and value when the control is
       * inserted. When false, no events are emitted.
       *
       * NOTE: Pushing to the FormArray will not mark it dirty. If you want to mark if dirty, call `markAsDirty()`.
       */
      push(control, options = {}) {
        if (Array.isArray(control)) {
          control.forEach((ctrl) => {
            this.controls.push(ctrl);
            this._registerControl(ctrl);
          });
        } else {
          this.controls.push(control);
          this._registerControl(control);
        }
        this.updateValueAndValidity({ emitEvent: options.emitEvent });
        this._onCollectionChange();
      }
      /**
       * Insert a new `AbstractControl` at the given `index` in the array.
       *
       * @param index Index in the array to insert the control. If `index` is negative, wraps around
       *     from the back. If `index` is greatly negative (less than `-length`), prepends to the array.
       * This behavior is the same as `Array.splice(index, 0, control)`.
       * @param control Form control to be inserted
       * @param options Specifies whether this FormArray instance should emit events after a new
       *     control is inserted.
       * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
       * `valueChanges` observables emit events with the latest status and value when the control is
       * inserted. When false, no events are emitted.
       *
       * NOTE: Inserting to the FormArray will not mark it dirty. If you want to mark if dirty, call `markAsDirty()`.
       */
      insert(index, control, options = {}) {
        this.controls.splice(index, 0, control);
        this._registerControl(control);
        this.updateValueAndValidity({ emitEvent: options.emitEvent });
      }
      /**
       * Remove the control at the given `index` in the array.
       *
       * @param index Index in the array to remove the control.  If `index` is negative, wraps around
       *     from the back. If `index` is greatly negative (less than `-length`), removes the first
       *     element. This behavior is the same as `Array.splice(index, 1)`.
       * @param options Specifies whether this FormArray instance should emit events after a
       *     control is removed.
       * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
       * `valueChanges` observables emit events with the latest status and value when the control is
       * removed. When false, no events are emitted.
       *
       * NOTE: Removing the FormArray will not mark it dirty. If you want to mark if dirty, call `markAsDirty()`.
       */
      removeAt(index, options = {}) {
        let adjustedIndex = this._adjustIndex(index);
        if (adjustedIndex < 0)
          adjustedIndex = 0;
        if (this.controls[adjustedIndex])
          this.controls[adjustedIndex]._registerOnCollectionChange(() => {
          });
        this.controls.splice(adjustedIndex, 1);
        this.updateValueAndValidity({ emitEvent: options.emitEvent });
      }
      /**
       * Replace an existing control.
       *
       * @param index Index in the array to replace the control. If `index` is negative, wraps around
       *     from the back. If `index` is greatly negative (less than `-length`), replaces the first
       *     element. This behavior is the same as `Array.splice(index, 1, control)`.
       * @param control The `AbstractControl` control to replace the existing control
       * @param options Specifies whether this FormArray instance should emit events after an
       *     existing control is replaced with a new one.
       * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
       * `valueChanges` observables emit events with the latest status and value when the control is
       * replaced with a new one. When false, no events are emitted.
       */
      setControl(index, control, options = {}) {
        let adjustedIndex = this._adjustIndex(index);
        if (adjustedIndex < 0)
          adjustedIndex = 0;
        if (this.controls[adjustedIndex])
          this.controls[adjustedIndex]._registerOnCollectionChange(() => {
          });
        this.controls.splice(adjustedIndex, 1);
        if (control) {
          this.controls.splice(adjustedIndex, 0, control);
          this._registerControl(control);
        }
        this.updateValueAndValidity({ emitEvent: options.emitEvent });
        this._onCollectionChange();
      }
      /**
       * Length of the control array.
       */
      get length() {
        return this.controls.length;
      }
      /**
       * Sets the value of the `FormArray`. It accepts an array that matches
       * the structure of the control.
       *
       * This method performs strict checks, and throws an error if you try
       * to set the value of a control that doesn't exist or if you exclude the
       * value of a control.
       *
       * @usageNotes
       * ### Set the values for the controls in the form array
       *
       * ```ts
       * const arr = new FormArray([
       *   new FormControl(),
       *   new FormControl()
       * ]);
       * console.log(arr.value);   // [null, null]
       *
       * arr.setValue(['Nancy', 'Drew']);
       * console.log(arr.value);   // ['Nancy', 'Drew']
       * ```
       *
       * @param value Array of values for the controls
       * @param options Configure options that determine how the control propagates changes and
       * emits events after the value changes
       *
       * * `onlySelf`: When true, each change only affects this control, and not its parent. Default
       * is false.
       * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
       * `valueChanges`
       * observables emit events with the latest status and value when the control value is updated.
       * When false, no events are emitted.
       * The configuration options are passed to the {@link AbstractControl#updateValueAndValidity
       * updateValueAndValidity} method.
       */
      setValue(value, options = {}) {
        assertAllValuesPresent(this, false, value);
        value.forEach((newValue, index) => {
          assertControlPresent(this, false, index);
          this.at(index).setValue(newValue, { onlySelf: true, emitEvent: options.emitEvent });
        });
        this.updateValueAndValidity(options);
      }
      /**
       * Patches the value of the `FormArray`. It accepts an array that matches the
       * structure of the control, and does its best to match the values to the correct
       * controls in the group.
       *
       * It accepts both super-sets and sub-sets of the array without throwing an error.
       *
       * @usageNotes
       * ### Patch the values for controls in a form array
       *
       * ```ts
       * const arr = new FormArray([
       *    new FormControl(),
       *    new FormControl()
       * ]);
       * console.log(arr.value);   // [null, null]
       *
       * arr.patchValue(['Nancy']);
       * console.log(arr.value);   // ['Nancy', null]
       * ```
       *
       * @param value Array of latest values for the controls
       * @param options Configure options that determine how the control propagates changes and
       * emits events after the value changes
       *
       * * `onlySelf`: When true, each change only affects this control, and not its parent. Default
       * is false.
       * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
       * `valueChanges` observables emit events with the latest status and value when the control
       * value is updated. When false, no events are emitted. The configuration options are passed to
       * the {@link AbstractControl#updateValueAndValidity updateValueAndValidity} method.
       */
      patchValue(value, options = {}) {
        if (value == null)
          return;
        value.forEach((newValue, index) => {
          if (this.at(index)) {
            this.at(index).patchValue(newValue, { onlySelf: true, emitEvent: options.emitEvent });
          }
        });
        this.updateValueAndValidity(options);
      }
      /**
       * Resets the `FormArray` and all descendants are marked `pristine` and `untouched`, and the
       * value of all descendants to null or null maps.
       *
       * You reset to a specific form state by passing in an array of states
       * that matches the structure of the control. The state is a standalone value
       * or a form state object with both a value and a disabled status.
       *
       * @usageNotes
       * ### Reset the values in a form array
       *
       * ```ts
       * const arr = new FormArray([
       *    new FormControl(),
       *    new FormControl()
       * ]);
       * arr.reset(['name', 'last name']);
       *
       * console.log(arr.value);  // ['name', 'last name']
       * ```
       *
       * ### Reset the values in a form array and the disabled status for the first control
       *
       * ```ts
       * arr.reset([
       *   {value: 'name', disabled: true},
       *   'last'
       * ]);
       *
       * console.log(arr.value);  // ['last']
       * console.log(arr.at(0).status);  // 'DISABLED'
       * ```
       *
       * @param value Array of values for the controls
       * @param options Configure options that determine how the control propagates changes and
       * emits events after the value changes
       *
       * * `onlySelf`: When true, each change only affects this control, and not its parent. Default
       * is false.
       * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
       * `valueChanges`
       * observables emit events with the latest status and value when the control is reset.
       * When false, no events are emitted.
       * The configuration options are passed to the {@link AbstractControl#updateValueAndValidity
       * updateValueAndValidity} method.
       */
      reset(value = [], options = {}) {
        this._forEachChild((control, index) => {
          control.reset(value[index], { onlySelf: true, emitEvent: options.emitEvent });
        });
        this._updatePristine(options, this);
        this._updateTouched(options, this);
        this.updateValueAndValidity(options);
        if (options?.emitEvent !== false) {
          this._events.next(new FormResetEvent(this));
        }
      }
      /**
       * The aggregate value of the array, including any disabled controls.
       *
       * Reports all values regardless of disabled status.
       */
      getRawValue() {
        return this.controls.map((control) => control.getRawValue());
      }
      /**
       * Remove all controls in the `FormArray`.
       *
       * @param options Specifies whether this FormArray instance should emit events after all
       *     controls are removed.
       * * `emitEvent`: When true or not supplied (the default), both the `statusChanges` and
       * `valueChanges` observables emit events with the latest status and value when all controls
       * in this FormArray instance are removed. When false, no events are emitted.
       *
       * @usageNotes
       * ### Remove all elements from a FormArray
       *
       * ```ts
       * const arr = new FormArray([
       *    new FormControl(),
       *    new FormControl()
       * ]);
       * console.log(arr.length);  // 2
       *
       * arr.clear();
       * console.log(arr.length);  // 0
       * ```
       *
       * It's a simpler and more efficient alternative to removing all elements one by one:
       *
       * ```ts
       * const arr = new FormArray([
       *    new FormControl(),
       *    new FormControl()
       * ]);
       *
       * while (arr.length) {
       *    arr.removeAt(0);
       * }
       * ```
       */
      clear(options = {}) {
        if (this.controls.length < 1)
          return;
        this._forEachChild((control) => control._registerOnCollectionChange(() => {
        }));
        this.controls.splice(0);
        this.updateValueAndValidity({ emitEvent: options.emitEvent });
      }
      /**
       * Adjusts a negative index by summing it with the length of the array. For very negative
       * indices, the result may remain negative.
       * @internal
       */
      _adjustIndex(index) {
        return index < 0 ? index + this.length : index;
      }
      /** @internal */
      _syncPendingControls() {
        let subtreeUpdated = this.controls.reduce((updated, child) => {
          return child._syncPendingControls() ? true : updated;
        }, false);
        if (subtreeUpdated)
          this.updateValueAndValidity({ onlySelf: true });
        return subtreeUpdated;
      }
      /** @internal */
      _forEachChild(cb) {
        this.controls.forEach((control, index) => {
          cb(control, index);
        });
      }
      /** @internal */
      _updateValue() {
        this.value = this.controls.filter((control) => control.enabled || this.disabled).map((control) => control.value);
      }
      /** @internal */
      _anyControls(condition) {
        return this.controls.some((control) => control.enabled && condition(control));
      }
      /** @internal */
      _setUpControls() {
        this._forEachChild((control) => this._registerControl(control));
      }
      /** @internal */
      _allControlsDisabled() {
        for (const control of this.controls) {
          if (control.enabled)
            return false;
        }
        return this.controls.length > 0 || this.disabled;
      }
      _registerControl(control) {
        control.setParent(this);
        control._registerOnCollectionChange(this._onCollectionChange);
      }
      /** @internal */
      _find(name) {
        return this.at(name) ?? null;
      }
    };
    FormBuilder = class _FormBuilder {
      useNonNullable = false;
      /**
       * @description
       * Returns a FormBuilder in which automatically constructed `FormControl` elements
       * have `{nonNullable: true}` and are non-nullable.
       *
       * **Constructing non-nullable controls**
       *
       * When constructing a control, it will be non-nullable, and will reset to its initial value.
       *
       * ```ts
       * let nnfb = new FormBuilder().nonNullable;
       * let name = nnfb.control('Alex'); // FormControl<string>
       * name.reset();
       * console.log(name); // 'Alex'
       * ```
       *
       * **Constructing non-nullable groups or arrays**
       *
       * When constructing a group or array, all automatically created inner controls will be
       * non-nullable, and will reset to their initial values.
       *
       * ```ts
       * let nnfb = new FormBuilder().nonNullable;
       * let name = nnfb.group({who: 'Alex'}); // FormGroup<{who: FormControl<string>}>
       * name.reset();
       * console.log(name); // {who: 'Alex'}
       * ```
       * **Constructing *nullable* fields on groups or arrays**
       *
       * It is still possible to have a nullable field. In particular, any `FormControl` which is
       * *already* constructed will not be altered. For example:
       *
       * ```ts
       * let nnfb = new FormBuilder().nonNullable;
       * // FormGroup<{who: FormControl<string|null>}>
       * let name = nnfb.group({who: new FormControl('Alex')});
       * name.reset(); console.log(name); // {who: null}
       * ```
       *
       * Because the inner control is constructed explicitly by the caller, the builder has
       * no control over how it is created, and cannot exclude the `null`.
       */
      get nonNullable() {
        const nnfb = new _FormBuilder();
        nnfb.useNonNullable = true;
        return nnfb;
      }
      group(controls, options = null) {
        const reducedControls = this._reduceControls(controls);
        let newOptions = {};
        if (isAbstractControlOptions(options)) {
          newOptions = options;
        } else if (options !== null) {
          newOptions.validators = options.validator;
          newOptions.asyncValidators = options.asyncValidator;
        }
        return new FormGroup(reducedControls, newOptions);
      }
      /**
       * @description
       * Constructs a new `FormRecord` instance. Accepts a single generic argument, which is an object
       * containing all the keys and corresponding inner control types.
       *
       * @param controls A collection of child controls. The key for each child is the name
       * under which it is registered.
       *
       * @param options Configuration options object for the `FormRecord`. The object should have the
       * `AbstractControlOptions` type and might contain the following fields:
       * * `validators`: A synchronous validator function, or an array of validator functions.
       * * `asyncValidators`: A single async validator or array of async validator functions.
       * * `updateOn`: The event upon which the control should be updated (options: 'change' | 'blur'
       * | submit').
       */
      record(controls, options = null) {
        const reducedControls = this._reduceControls(controls);
        return new FormRecord(reducedControls, options);
      }
      /**
       * @description
       * Constructs a new `FormControl` with the given state, validators and options. Sets
       * `{nonNullable: true}` in the options to get a non-nullable control. Otherwise, the
       * control will be nullable. Accepts a single generic argument, which is the type  of the
       * control's value.
       *
       * @param formState Initializes the control with an initial state value, or
       * with an object that contains both a value and a disabled status.
       *
       * @param validatorOrOpts A synchronous validator function, or an array of
       * such functions, or a `FormControlOptions` object that contains
       * validation functions and a validation trigger.
       *
       * @param asyncValidator A single async validator or array of async validator
       * functions.
       *
       * @usageNotes
       *
       * ### Initialize a control as disabled
       *
       * The following example returns a control with an initial value in a disabled state.
       *
       * {@example forms/ts/formBuilder/form_builder_example.ts region='disabled-control'}
       */
      control(formState, validatorOrOpts, asyncValidator) {
        let newOptions = {};
        if (!this.useNonNullable) {
          return new FormControl(formState, validatorOrOpts, asyncValidator);
        }
        if (isAbstractControlOptions(validatorOrOpts)) {
          newOptions = validatorOrOpts;
        } else {
          newOptions.validators = validatorOrOpts;
          newOptions.asyncValidators = asyncValidator;
        }
        return new FormControl(formState, __spreadProps(__spreadValues({}, newOptions), { nonNullable: true }));
      }
      /**
       * Constructs a new `FormArray` from the given array of configurations,
       * validators and options. Accepts a single generic argument, which is the type of each control
       * inside the array.
       *
       * @param controls An array of child controls or control configs. Each child control is given an
       *     index when it is registered.
       *
       * @param validatorOrOpts A synchronous validator function, or an array of such functions, or an
       *     `AbstractControlOptions` object that contains
       * validation functions and a validation trigger.
       *
       * @param asyncValidator A single async validator or array of async validator functions.
       */
      array(controls, validatorOrOpts, asyncValidator) {
        const createdControls = controls.map((c) => this._createControl(c));
        return new FormArray(createdControls, validatorOrOpts, asyncValidator);
      }
      /** @internal */
      _reduceControls(controls) {
        const createdControls = {};
        Object.keys(controls).forEach((controlName) => {
          createdControls[controlName] = this._createControl(controls[controlName]);
        });
        return createdControls;
      }
      /** @internal */
      _createControl(controls) {
        if (controls instanceof FormControl) {
          return controls;
        } else if (controls instanceof AbstractControl) {
          return controls;
        } else if (Array.isArray(controls)) {
          const value = controls[0];
          const validator = controls.length > 1 ? controls[1] : null;
          const asyncValidator = controls.length > 2 ? controls[2] : null;
          return this.control(value, validator, asyncValidator);
        } else {
          return this.control(controls);
        }
      }
      static \u0275fac = \u0275\u0275ngDeclareFactory({ minVersion: "12.0.0", version: "20.3.11", ngImport: core_exports, type: _FormBuilder, deps: [], target: FactoryTarget.Injectable });
      static \u0275prov = \u0275\u0275ngDeclareInjectable({ minVersion: "12.0.0", version: "20.3.11", ngImport: core_exports, type: _FormBuilder, providedIn: "root" });
    };
    \u0275\u0275ngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.3.11", ngImport: core_exports, type: FormBuilder, decorators: [{
      type: Injectable,
      args: [{ providedIn: "root" }]
    }] });
    NonNullableFormBuilder = class _NonNullableFormBuilder {
      static \u0275fac = \u0275\u0275ngDeclareFactory({ minVersion: "12.0.0", version: "20.3.11", ngImport: core_exports, type: _NonNullableFormBuilder, deps: [], target: FactoryTarget.Injectable });
      static \u0275prov = \u0275\u0275ngDeclareInjectable({ minVersion: "12.0.0", version: "20.3.11", ngImport: core_exports, type: _NonNullableFormBuilder, providedIn: "root", useFactory: () => inject(FormBuilder).nonNullable });
    };
    \u0275\u0275ngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.3.11", ngImport: core_exports, type: NonNullableFormBuilder, decorators: [{
      type: Injectable,
      args: [{
        providedIn: "root",
        useFactory: () => inject(FormBuilder).nonNullable
      }]
    }] });
    UntypedFormBuilder = class _UntypedFormBuilder extends FormBuilder {
      group(controlsConfig, options = null) {
        return super.group(controlsConfig, options);
      }
      /**
       * Like `FormBuilder#control`, except the resulting control is untyped.
       */
      control(formState, validatorOrOpts, asyncValidator) {
        return super.control(formState, validatorOrOpts, asyncValidator);
      }
      /**
       * Like `FormBuilder#array`, except the resulting array is untyped.
       */
      array(controlsConfig, validatorOrOpts, asyncValidator) {
        return super.array(controlsConfig, validatorOrOpts, asyncValidator);
      }
      static \u0275fac = \u0275\u0275ngDeclareFactory({ minVersion: "12.0.0", version: "20.3.11", ngImport: core_exports, type: _UntypedFormBuilder, deps: null, target: FactoryTarget.Injectable });
      static \u0275prov = \u0275\u0275ngDeclareInjectable({ minVersion: "12.0.0", version: "20.3.11", ngImport: core_exports, type: _UntypedFormBuilder, providedIn: "root" });
    };
    \u0275\u0275ngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.3.11", ngImport: core_exports, type: UntypedFormBuilder, decorators: [{
      type: Injectable,
      args: [{ providedIn: "root" }]
    }] });
    FormsModule = class _FormsModule {
      /**
       * @description
       * Provides options for configuring the forms module.
       *
       * @param opts An object of configuration options
       * * `callSetDisabledState` Configures whether to `always` call `setDisabledState`, which is more
       * correct, or to only call it `whenDisabled`, which is the legacy behavior.
       */
      static withConfig(opts) {
        return {
          ngModule: _FormsModule,
          providers: [
            {
              provide: CALL_SET_DISABLED_STATE,
              useValue: opts.callSetDisabledState ?? setDisabledStateDefault
            }
          ]
        };
      }
      static \u0275fac = \u0275\u0275ngDeclareFactory({ minVersion: "12.0.0", version: "20.3.11", ngImport: core_exports, type: _FormsModule, deps: [], target: FactoryTarget.NgModule });
      static \u0275mod = \u0275\u0275ngDeclareNgModule({ minVersion: "14.0.0", version: "20.3.11", ngImport: core_exports, type: _FormsModule, declarations: [NgModel, NgModelGroup, NgForm], exports: [\u0275InternalFormsSharedModule, NgModel, NgModelGroup, NgForm] });
      static \u0275inj = \u0275\u0275ngDeclareInjector({ minVersion: "12.0.0", version: "20.3.11", ngImport: core_exports, type: _FormsModule, imports: [\u0275InternalFormsSharedModule] });
    };
    \u0275\u0275ngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.3.11", ngImport: core_exports, type: FormsModule, decorators: [{
      type: NgModule,
      args: [{
        declarations: TEMPLATE_DRIVEN_DIRECTIVES,
        exports: [\u0275InternalFormsSharedModule, TEMPLATE_DRIVEN_DIRECTIVES]
      }]
    }] });
    ReactiveFormsModule = class _ReactiveFormsModule {
      /**
       * @description
       * Provides options for configuring the reactive forms module.
       *
       * @param opts An object of configuration options
       * * `warnOnNgModelWithFormControl` Configures when to emit a warning when an `ngModel`
       * binding is used with reactive form directives.
       * * `callSetDisabledState` Configures whether to `always` call `setDisabledState`, which is more
       * correct, or to only call it `whenDisabled`, which is the legacy behavior.
       */
      static withConfig(opts) {
        return {
          ngModule: _ReactiveFormsModule,
          providers: [
            {
              provide: NG_MODEL_WITH_FORM_CONTROL_WARNING,
              useValue: opts.warnOnNgModelWithFormControl ?? "always"
            },
            {
              provide: CALL_SET_DISABLED_STATE,
              useValue: opts.callSetDisabledState ?? setDisabledStateDefault
            }
          ]
        };
      }
      static \u0275fac = \u0275\u0275ngDeclareFactory({ minVersion: "12.0.0", version: "20.3.11", ngImport: core_exports, type: _ReactiveFormsModule, deps: [], target: FactoryTarget.NgModule });
      static \u0275mod = \u0275\u0275ngDeclareNgModule({ minVersion: "14.0.0", version: "20.3.11", ngImport: core_exports, type: _ReactiveFormsModule, declarations: [FormControlDirective, FormGroupDirective, FormControlName, FormGroupName, FormArrayName], exports: [\u0275InternalFormsSharedModule, FormControlDirective, FormGroupDirective, FormControlName, FormGroupName, FormArrayName] });
      static \u0275inj = \u0275\u0275ngDeclareInjector({ minVersion: "12.0.0", version: "20.3.11", ngImport: core_exports, type: _ReactiveFormsModule, imports: [\u0275InternalFormsSharedModule] });
    };
    \u0275\u0275ngDeclareClassMetadata({ minVersion: "12.0.0", version: "20.3.11", ngImport: core_exports, type: ReactiveFormsModule, decorators: [{
      type: NgModule,
      args: [{
        declarations: [REACTIVE_DRIVEN_DIRECTIVES],
        exports: [\u0275InternalFormsSharedModule, REACTIVE_DRIVEN_DIRECTIVES]
      }]
    }] });
  }
});

// src/environments/environment.ts
var environment;
var init_environment = __esm({
  "src/environments/environment.ts"() {
    "use strict";
    environment = {
      production: false,
      apiUrl: "/api"
    };
  }
});

// src/app/core/services/auth.service.ts
var AuthService;
var init_auth_service = __esm({
  "src/app/core/services/auth.service.ts"() {
    "use strict";
    init_tslib_es6();
    init_http();
    init_core();
    init_environment();
    AuthService = class AuthService2 {
      http = inject(HttpClient);
      apiUrl = `${environment.apiUrl}/Auth`;
      register(data) {
        return this.http.post(`${this.apiUrl}/register`, data);
      }
      verifyEmail(data) {
        return this.http.post(`${this.apiUrl}/confirm-email`, data);
      }
      login(data) {
        return this.http.post(`${this.apiUrl}/login`, data);
      }
      forgotPassword(data) {
        return this.http.post(`${this.apiUrl}/forgot-password`, data);
      }
      resetPassword(data) {
        return this.http.post(`${this.apiUrl}/reset-password`, data);
      }
      refreshToken(data) {
        return this.http.post(`${this.apiUrl}/refresh-token`, data);
      }
    };
    AuthService = __decorate([
      Injectable({
        providedIn: "root"
      })
    ], AuthService);
  }
});

// node_modules/sweetalert2/dist/sweetalert2.all.js
var require_sweetalert2_all = __commonJS({
  "node_modules/sweetalert2/dist/sweetalert2.all.js"(exports, module) {
    "use strict";
    (function(global, factory) {
      typeof exports === "object" && typeof module !== "undefined" ? module.exports = factory() : typeof define === "function" && define.amd ? define(factory) : (global = typeof globalThis !== "undefined" ? globalThis : global || self, global.Sweetalert2 = factory());
    })(exports, (function() {
      "use strict";
      function _assertClassBrand(e, t, n) {
        if ("function" == typeof e ? e === t : e.has(t)) return arguments.length < 3 ? t : n;
        throw new TypeError("Private element is not present on this object");
      }
      function _checkPrivateRedeclaration(e, t) {
        if (t.has(e)) throw new TypeError("Cannot initialize the same private elements twice on an object");
      }
      function _classPrivateFieldGet2(s, a) {
        return s.get(_assertClassBrand(s, a));
      }
      function _classPrivateFieldInitSpec(e, t, a) {
        _checkPrivateRedeclaration(e, t), t.set(e, a);
      }
      function _classPrivateFieldSet2(s, a, r) {
        return s.set(_assertClassBrand(s, a), r), r;
      }
      const RESTORE_FOCUS_TIMEOUT = 100;
      const globalState = {};
      const focusPreviousActiveElement = () => {
        if (globalState.previousActiveElement instanceof HTMLElement) {
          globalState.previousActiveElement.focus();
          globalState.previousActiveElement = null;
        } else if (document.body) {
          document.body.focus();
        }
      };
      const restoreActiveElement = (returnFocus) => {
        return new Promise((resolve) => {
          if (!returnFocus) {
            return resolve();
          }
          const x = window.scrollX;
          const y = window.scrollY;
          globalState.restoreFocusTimeout = setTimeout(() => {
            focusPreviousActiveElement();
            resolve();
          }, RESTORE_FOCUS_TIMEOUT);
          window.scrollTo(x, y);
        });
      };
      const swalPrefix = "swal2-";
      const classNames = ["container", "shown", "height-auto", "iosfix", "popup", "modal", "no-backdrop", "no-transition", "toast", "toast-shown", "show", "hide", "close", "title", "html-container", "actions", "confirm", "deny", "cancel", "footer", "icon", "icon-content", "image", "input", "file", "range", "select", "radio", "checkbox", "label", "textarea", "inputerror", "input-label", "validation-message", "progress-steps", "active-progress-step", "progress-step", "progress-step-line", "loader", "loading", "styled", "top", "top-start", "top-end", "top-left", "top-right", "center", "center-start", "center-end", "center-left", "center-right", "bottom", "bottom-start", "bottom-end", "bottom-left", "bottom-right", "grow-row", "grow-column", "grow-fullscreen", "rtl", "timer-progress-bar", "timer-progress-bar-container", "scrollbar-measure", "icon-success", "icon-warning", "icon-info", "icon-question", "icon-error", "draggable", "dragging"];
      const swalClasses = classNames.reduce(
        (acc, className) => {
          acc[className] = swalPrefix + className;
          return acc;
        },
        /** @type {SwalClasses} */
        {}
      );
      const icons = ["success", "warning", "info", "question", "error"];
      const iconTypes = icons.reduce(
        (acc, icon) => {
          acc[icon] = swalPrefix + icon;
          return acc;
        },
        /** @type {SwalIcons} */
        {}
      );
      const consolePrefix = "SweetAlert2:";
      const capitalizeFirstLetter = (str) => str.charAt(0).toUpperCase() + str.slice(1);
      const warn = (message) => {
        console.warn(`${consolePrefix} ${typeof message === "object" ? message.join(" ") : message}`);
      };
      const error = (message) => {
        console.error(`${consolePrefix} ${message}`);
      };
      const previousWarnOnceMessages = [];
      const warnOnce = (message) => {
        if (!previousWarnOnceMessages.includes(message)) {
          previousWarnOnceMessages.push(message);
          warn(message);
        }
      };
      const warnAboutDeprecation = (deprecatedParam, useInstead = null) => {
        warnOnce(`"${deprecatedParam}" is deprecated and will be removed in the next major release.${useInstead ? ` Use "${useInstead}" instead.` : ""}`);
      };
      const callIfFunction = (arg) => typeof arg === "function" ? arg() : arg;
      const hasToPromiseFn = (arg) => arg && typeof arg.toPromise === "function";
      const asPromise = (arg) => hasToPromiseFn(arg) ? arg.toPromise() : Promise.resolve(arg);
      const isPromise2 = (arg) => arg && Promise.resolve(arg) === arg;
      const getContainer = () => document.body.querySelector(`.${swalClasses.container}`);
      const elementBySelector = (selectorString) => {
        const container = getContainer();
        return container ? container.querySelector(selectorString) : null;
      };
      const elementByClass = (className) => {
        return elementBySelector(`.${className}`);
      };
      const getPopup = () => elementByClass(swalClasses.popup);
      const getIcon = () => elementByClass(swalClasses.icon);
      const getIconContent = () => elementByClass(swalClasses["icon-content"]);
      const getTitle = () => elementByClass(swalClasses.title);
      const getHtmlContainer = () => elementByClass(swalClasses["html-container"]);
      const getImage = () => elementByClass(swalClasses.image);
      const getProgressSteps = () => elementByClass(swalClasses["progress-steps"]);
      const getValidationMessage = () => elementByClass(swalClasses["validation-message"]);
      const getConfirmButton = () => (
        /** @type {HTMLButtonElement} */
        elementBySelector(`.${swalClasses.actions} .${swalClasses.confirm}`)
      );
      const getCancelButton = () => (
        /** @type {HTMLButtonElement} */
        elementBySelector(`.${swalClasses.actions} .${swalClasses.cancel}`)
      );
      const getDenyButton = () => (
        /** @type {HTMLButtonElement} */
        elementBySelector(`.${swalClasses.actions} .${swalClasses.deny}`)
      );
      const getInputLabel = () => elementByClass(swalClasses["input-label"]);
      const getLoader = () => elementBySelector(`.${swalClasses.loader}`);
      const getActions = () => elementByClass(swalClasses.actions);
      const getFooter = () => elementByClass(swalClasses.footer);
      const getTimerProgressBar = () => elementByClass(swalClasses["timer-progress-bar"]);
      const getCloseButton = () => elementByClass(swalClasses.close);
      const focusable = `
  a[href],
  area[href],
  input:not([disabled]),
  select:not([disabled]),
  textarea:not([disabled]),
  button:not([disabled]),
  iframe,
  object,
  embed,
  [tabindex="0"],
  [contenteditable],
  audio[controls],
  video[controls],
  summary
`;
      const getFocusableElements = () => {
        const popup = getPopup();
        if (!popup) {
          return [];
        }
        const focusableElementsWithTabindex = popup.querySelectorAll('[tabindex]:not([tabindex="-1"]):not([tabindex="0"])');
        const focusableElementsWithTabindexSorted = Array.from(focusableElementsWithTabindex).sort((a, b) => {
          const tabindexA = parseInt(a.getAttribute("tabindex") || "0");
          const tabindexB = parseInt(b.getAttribute("tabindex") || "0");
          if (tabindexA > tabindexB) {
            return 1;
          } else if (tabindexA < tabindexB) {
            return -1;
          }
          return 0;
        });
        const otherFocusableElements = popup.querySelectorAll(focusable);
        const otherFocusableElementsFiltered = Array.from(otherFocusableElements).filter((el) => el.getAttribute("tabindex") !== "-1");
        return [...new Set(focusableElementsWithTabindexSorted.concat(otherFocusableElementsFiltered))].filter((el) => isVisible$1(el));
      };
      const isModal = () => {
        return hasClass(document.body, swalClasses.shown) && !hasClass(document.body, swalClasses["toast-shown"]) && !hasClass(document.body, swalClasses["no-backdrop"]);
      };
      const isToast = () => {
        const popup = getPopup();
        if (!popup) {
          return false;
        }
        return hasClass(popup, swalClasses.toast);
      };
      const isLoading = () => {
        const popup = getPopup();
        if (!popup) {
          return false;
        }
        return popup.hasAttribute("data-loading");
      };
      const setInnerHtml = (elem, html) => {
        elem.textContent = "";
        if (html) {
          const parser = new DOMParser();
          const parsed = parser.parseFromString(html, `text/html`);
          const head = parsed.querySelector("head");
          if (head) {
            Array.from(head.childNodes).forEach((child) => {
              elem.appendChild(child);
            });
          }
          const body = parsed.querySelector("body");
          if (body) {
            Array.from(body.childNodes).forEach((child) => {
              if (child instanceof HTMLVideoElement || child instanceof HTMLAudioElement) {
                elem.appendChild(child.cloneNode(true));
              } else {
                elem.appendChild(child);
              }
            });
          }
        }
      };
      const hasClass = (elem, className) => {
        if (!className) {
          return false;
        }
        const classList = className.split(/\s+/);
        for (let i = 0; i < classList.length; i++) {
          if (!elem.classList.contains(classList[i])) {
            return false;
          }
        }
        return true;
      };
      const removeCustomClasses = (elem, params) => {
        Array.from(elem.classList).forEach((className) => {
          if (!Object.values(swalClasses).includes(className) && !Object.values(iconTypes).includes(className) && !Object.values(params.showClass || {}).includes(className)) {
            elem.classList.remove(className);
          }
        });
      };
      const applyCustomClass = (elem, params, className) => {
        removeCustomClasses(elem, params);
        if (!params.customClass) {
          return;
        }
        const customClass = params.customClass[
          /** @type {keyof SweetAlertCustomClass} */
          className
        ];
        if (!customClass) {
          return;
        }
        if (typeof customClass !== "string" && !customClass.forEach) {
          warn(`Invalid type of customClass.${className}! Expected string or iterable object, got "${typeof customClass}"`);
          return;
        }
        addClass(elem, customClass);
      };
      const getInput$1 = (popup, inputClass) => {
        if (!inputClass) {
          return null;
        }
        switch (inputClass) {
          case "select":
          case "textarea":
          case "file":
            return popup.querySelector(`.${swalClasses.popup} > .${swalClasses[inputClass]}`);
          case "checkbox":
            return popup.querySelector(`.${swalClasses.popup} > .${swalClasses.checkbox} input`);
          case "radio":
            return popup.querySelector(`.${swalClasses.popup} > .${swalClasses.radio} input:checked`) || popup.querySelector(`.${swalClasses.popup} > .${swalClasses.radio} input:first-child`);
          case "range":
            return popup.querySelector(`.${swalClasses.popup} > .${swalClasses.range} input`);
          default:
            return popup.querySelector(`.${swalClasses.popup} > .${swalClasses.input}`);
        }
      };
      const focusInput = (input) => {
        input.focus();
        if (input.type !== "file") {
          const val = input.value;
          input.value = "";
          input.value = val;
        }
      };
      const toggleClass = (target, classList, condition) => {
        if (!target || !classList) {
          return;
        }
        if (typeof classList === "string") {
          classList = classList.split(/\s+/).filter(Boolean);
        }
        classList.forEach((className) => {
          if (Array.isArray(target)) {
            target.forEach((elem) => {
              if (condition) {
                elem.classList.add(className);
              } else {
                elem.classList.remove(className);
              }
            });
          } else {
            if (condition) {
              target.classList.add(className);
            } else {
              target.classList.remove(className);
            }
          }
        });
      };
      const addClass = (target, classList) => {
        toggleClass(target, classList, true);
      };
      const removeClass = (target, classList) => {
        toggleClass(target, classList, false);
      };
      const getDirectChildByClass = (elem, className) => {
        const children = Array.from(elem.children);
        for (let i = 0; i < children.length; i++) {
          const child = children[i];
          if (child instanceof HTMLElement && hasClass(child, className)) {
            return child;
          }
        }
      };
      const applyNumericalStyle = (elem, property, value) => {
        if (value === `${parseInt(`${value}`)}`) {
          value = parseInt(value);
        }
        if (value || parseInt(`${value}`) === 0) {
          elem.style.setProperty(property, typeof value === "number" ? `${value}px` : value);
        } else {
          elem.style.removeProperty(property);
        }
      };
      const show = (elem, display = "flex") => {
        if (!elem) {
          return;
        }
        elem.style.display = display;
      };
      const hide = (elem) => {
        if (!elem) {
          return;
        }
        elem.style.display = "none";
      };
      const showWhenInnerHtmlPresent = (elem, display = "block") => {
        if (!elem) {
          return;
        }
        new MutationObserver(() => {
          toggle(elem, elem.innerHTML, display);
        }).observe(elem, {
          childList: true,
          subtree: true
        });
      };
      const setStyle = (parent, selector, property, value) => {
        const el = parent.querySelector(selector);
        if (el) {
          el.style.setProperty(property, value);
        }
      };
      const toggle = (elem, condition, display = "flex") => {
        if (condition) {
          show(elem, display);
        } else {
          hide(elem);
        }
      };
      const isVisible$1 = (elem) => !!(elem && (elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length));
      const allButtonsAreHidden = () => !isVisible$1(getConfirmButton()) && !isVisible$1(getDenyButton()) && !isVisible$1(getCancelButton());
      const isScrollable = (elem) => !!(elem.scrollHeight > elem.clientHeight);
      const selfOrParentIsScrollable = (element, stopElement) => {
        let parent = element;
        while (parent && parent !== stopElement) {
          if (isScrollable(parent)) {
            return true;
          }
          parent = parent.parentElement;
        }
        return false;
      };
      const hasCssAnimation = (elem) => {
        const style = window.getComputedStyle(elem);
        const animDuration = parseFloat(style.getPropertyValue("animation-duration") || "0");
        const transDuration = parseFloat(style.getPropertyValue("transition-duration") || "0");
        return animDuration > 0 || transDuration > 0;
      };
      const animateTimerProgressBar = (timer, reset = false) => {
        const timerProgressBar = getTimerProgressBar();
        if (!timerProgressBar) {
          return;
        }
        if (isVisible$1(timerProgressBar)) {
          if (reset) {
            timerProgressBar.style.transition = "none";
            timerProgressBar.style.width = "100%";
          }
          setTimeout(() => {
            timerProgressBar.style.transition = `width ${timer / 1e3}s linear`;
            timerProgressBar.style.width = "0%";
          }, 10);
        }
      };
      const stopTimerProgressBar = () => {
        const timerProgressBar = getTimerProgressBar();
        if (!timerProgressBar) {
          return;
        }
        const timerProgressBarWidth = parseInt(window.getComputedStyle(timerProgressBar).width);
        timerProgressBar.style.removeProperty("transition");
        timerProgressBar.style.width = "100%";
        const timerProgressBarFullWidth = parseInt(window.getComputedStyle(timerProgressBar).width);
        const timerProgressBarPercent = timerProgressBarWidth / timerProgressBarFullWidth * 100;
        timerProgressBar.style.width = `${timerProgressBarPercent}%`;
      };
      const isNodeEnv = () => typeof window === "undefined" || typeof document === "undefined";
      const sweetHTML = `
 <div aria-labelledby="${swalClasses.title}" aria-describedby="${swalClasses["html-container"]}" class="${swalClasses.popup}" tabindex="-1">
   <button type="button" class="${swalClasses.close}"></button>
   <ul class="${swalClasses["progress-steps"]}"></ul>
   <div class="${swalClasses.icon}"></div>
   <img class="${swalClasses.image}" />
   <h2 class="${swalClasses.title}" id="${swalClasses.title}"></h2>
   <div class="${swalClasses["html-container"]}" id="${swalClasses["html-container"]}"></div>
   <input class="${swalClasses.input}" id="${swalClasses.input}" />
   <input type="file" class="${swalClasses.file}" />
   <div class="${swalClasses.range}">
     <input type="range" />
     <output></output>
   </div>
   <select class="${swalClasses.select}" id="${swalClasses.select}"></select>
   <div class="${swalClasses.radio}"></div>
   <label class="${swalClasses.checkbox}">
     <input type="checkbox" id="${swalClasses.checkbox}" />
     <span class="${swalClasses.label}"></span>
   </label>
   <textarea class="${swalClasses.textarea}" id="${swalClasses.textarea}"></textarea>
   <div class="${swalClasses["validation-message"]}" id="${swalClasses["validation-message"]}"></div>
   <div class="${swalClasses.actions}">
     <div class="${swalClasses.loader}"></div>
     <button type="button" class="${swalClasses.confirm}"></button>
     <button type="button" class="${swalClasses.deny}"></button>
     <button type="button" class="${swalClasses.cancel}"></button>
   </div>
   <div class="${swalClasses.footer}"></div>
   <div class="${swalClasses["timer-progress-bar-container"]}">
     <div class="${swalClasses["timer-progress-bar"]}"></div>
   </div>
 </div>
`.replace(/(^|\n)\s*/g, "");
      const resetOldContainer = () => {
        const oldContainer = getContainer();
        if (!oldContainer) {
          return false;
        }
        oldContainer.remove();
        removeClass([document.documentElement, document.body], [swalClasses["no-backdrop"], swalClasses["toast-shown"], swalClasses["has-column"]]);
        return true;
      };
      const resetValidationMessage$1 = () => {
        globalState.currentInstance.resetValidationMessage();
      };
      const addInputChangeListeners = () => {
        const popup = getPopup();
        const input = getDirectChildByClass(popup, swalClasses.input);
        const file = getDirectChildByClass(popup, swalClasses.file);
        const range = popup.querySelector(`.${swalClasses.range} input`);
        const rangeOutput = popup.querySelector(`.${swalClasses.range} output`);
        const select = getDirectChildByClass(popup, swalClasses.select);
        const checkbox = popup.querySelector(`.${swalClasses.checkbox} input`);
        const textarea = getDirectChildByClass(popup, swalClasses.textarea);
        input.oninput = resetValidationMessage$1;
        file.onchange = resetValidationMessage$1;
        select.onchange = resetValidationMessage$1;
        checkbox.onchange = resetValidationMessage$1;
        textarea.oninput = resetValidationMessage$1;
        range.oninput = () => {
          resetValidationMessage$1();
          rangeOutput.value = range.value;
        };
        range.onchange = () => {
          resetValidationMessage$1();
          rangeOutput.value = range.value;
        };
      };
      const getTarget = (target) => typeof target === "string" ? document.querySelector(target) : target;
      const setupAccessibility = (params) => {
        const popup = getPopup();
        popup.setAttribute("role", params.toast ? "alert" : "dialog");
        popup.setAttribute("aria-live", params.toast ? "polite" : "assertive");
        if (!params.toast) {
          popup.setAttribute("aria-modal", "true");
        }
      };
      const setupRTL = (targetElement) => {
        if (window.getComputedStyle(targetElement).direction === "rtl") {
          addClass(getContainer(), swalClasses.rtl);
        }
      };
      const init = (params) => {
        const oldContainerExisted = resetOldContainer();
        if (isNodeEnv()) {
          error("SweetAlert2 requires document to initialize");
          return;
        }
        const container = document.createElement("div");
        container.className = swalClasses.container;
        if (oldContainerExisted) {
          addClass(container, swalClasses["no-transition"]);
        }
        setInnerHtml(container, sweetHTML);
        container.dataset["swal2Theme"] = params.theme;
        const targetElement = getTarget(params.target);
        targetElement.appendChild(container);
        if (params.topLayer) {
          container.setAttribute("popover", "");
          container.showPopover();
        }
        setupAccessibility(params);
        setupRTL(targetElement);
        addInputChangeListeners();
      };
      const parseHtmlToContainer = (param, target) => {
        if (param instanceof HTMLElement) {
          target.appendChild(param);
        } else if (typeof param === "object") {
          handleObject(param, target);
        } else if (param) {
          setInnerHtml(target, param);
        }
      };
      const handleObject = (param, target) => {
        if (param.jquery) {
          handleJqueryElem(target, param);
        } else {
          setInnerHtml(target, param.toString());
        }
      };
      const handleJqueryElem = (target, elem) => {
        target.textContent = "";
        if (0 in elem) {
          for (let i = 0; i in elem; i++) {
            target.appendChild(elem[i].cloneNode(true));
          }
        } else {
          target.appendChild(elem.cloneNode(true));
        }
      };
      const renderActions = (instance, params) => {
        const actions = getActions();
        const loader = getLoader();
        if (!actions || !loader) {
          return;
        }
        if (!params.showConfirmButton && !params.showDenyButton && !params.showCancelButton) {
          hide(actions);
        } else {
          show(actions);
        }
        applyCustomClass(actions, params, "actions");
        renderButtons(actions, loader, params);
        setInnerHtml(loader, params.loaderHtml || "");
        applyCustomClass(loader, params, "loader");
      };
      function renderButtons(actions, loader, params) {
        const confirmButton = getConfirmButton();
        const denyButton = getDenyButton();
        const cancelButton = getCancelButton();
        if (!confirmButton || !denyButton || !cancelButton) {
          return;
        }
        renderButton(confirmButton, "confirm", params);
        renderButton(denyButton, "deny", params);
        renderButton(cancelButton, "cancel", params);
        handleButtonsStyling(confirmButton, denyButton, cancelButton, params);
        if (params.reverseButtons) {
          if (params.toast) {
            actions.insertBefore(cancelButton, confirmButton);
            actions.insertBefore(denyButton, confirmButton);
          } else {
            actions.insertBefore(cancelButton, loader);
            actions.insertBefore(denyButton, loader);
            actions.insertBefore(confirmButton, loader);
          }
        }
      }
      function handleButtonsStyling(confirmButton, denyButton, cancelButton, params) {
        if (!params.buttonsStyling) {
          removeClass([confirmButton, denyButton, cancelButton], swalClasses.styled);
          return;
        }
        addClass([confirmButton, denyButton, cancelButton], swalClasses.styled);
        if (params.confirmButtonColor) {
          confirmButton.style.setProperty("--swal2-confirm-button-background-color", params.confirmButtonColor);
        }
        if (params.denyButtonColor) {
          denyButton.style.setProperty("--swal2-deny-button-background-color", params.denyButtonColor);
        }
        if (params.cancelButtonColor) {
          cancelButton.style.setProperty("--swal2-cancel-button-background-color", params.cancelButtonColor);
        }
        applyOutlineColor(confirmButton);
        applyOutlineColor(denyButton);
        applyOutlineColor(cancelButton);
      }
      function applyOutlineColor(button) {
        const buttonStyle = window.getComputedStyle(button);
        if (buttonStyle.getPropertyValue("--swal2-action-button-focus-box-shadow")) {
          return;
        }
        const outlineColor = buttonStyle.backgroundColor.replace(/rgba?\((\d+), (\d+), (\d+).*/, "rgba($1, $2, $3, 0.5)");
        button.style.setProperty("--swal2-action-button-focus-box-shadow", buttonStyle.getPropertyValue("--swal2-outline").replace(/ rgba\(.*/, ` ${outlineColor}`));
      }
      function renderButton(button, buttonType, params) {
        const buttonName = (
          /** @type {'Confirm' | 'Deny' | 'Cancel'} */
          capitalizeFirstLetter(buttonType)
        );
        toggle(button, params[`show${buttonName}Button`], "inline-block");
        setInnerHtml(button, params[`${buttonType}ButtonText`] || "");
        button.setAttribute("aria-label", params[`${buttonType}ButtonAriaLabel`] || "");
        button.className = swalClasses[buttonType];
        applyCustomClass(button, params, `${buttonType}Button`);
      }
      const renderCloseButton = (instance, params) => {
        const closeButton = getCloseButton();
        if (!closeButton) {
          return;
        }
        setInnerHtml(closeButton, params.closeButtonHtml || "");
        applyCustomClass(closeButton, params, "closeButton");
        toggle(closeButton, params.showCloseButton);
        closeButton.setAttribute("aria-label", params.closeButtonAriaLabel || "");
      };
      const renderContainer = (instance, params) => {
        const container = getContainer();
        if (!container) {
          return;
        }
        handleBackdropParam(container, params.backdrop);
        handlePositionParam(container, params.position);
        handleGrowParam(container, params.grow);
        applyCustomClass(container, params, "container");
      };
      function handleBackdropParam(container, backdrop) {
        if (typeof backdrop === "string") {
          container.style.background = backdrop;
        } else if (!backdrop) {
          addClass([document.documentElement, document.body], swalClasses["no-backdrop"]);
        }
      }
      function handlePositionParam(container, position) {
        if (!position) {
          return;
        }
        if (position in swalClasses) {
          addClass(container, swalClasses[position]);
        } else {
          warn('The "position" parameter is not valid, defaulting to "center"');
          addClass(container, swalClasses.center);
        }
      }
      function handleGrowParam(container, grow) {
        if (!grow) {
          return;
        }
        addClass(container, swalClasses[`grow-${grow}`]);
      }
      var privateProps = {
        innerParams: /* @__PURE__ */ new WeakMap(),
        domCache: /* @__PURE__ */ new WeakMap()
      };
      const inputClasses = ["input", "file", "range", "select", "radio", "checkbox", "textarea"];
      const renderInput = (instance, params) => {
        const popup = getPopup();
        if (!popup) {
          return;
        }
        const innerParams = privateProps.innerParams.get(instance);
        const rerender = !innerParams || params.input !== innerParams.input;
        inputClasses.forEach((inputClass) => {
          const inputContainer = getDirectChildByClass(popup, swalClasses[inputClass]);
          if (!inputContainer) {
            return;
          }
          setAttributes(inputClass, params.inputAttributes);
          inputContainer.className = swalClasses[inputClass];
          if (rerender) {
            hide(inputContainer);
          }
        });
        if (params.input) {
          if (rerender) {
            showInput(params);
          }
          setCustomClass(params);
        }
      };
      const showInput = (params) => {
        if (!params.input) {
          return;
        }
        if (!renderInputType[params.input]) {
          error(`Unexpected type of input! Expected ${Object.keys(renderInputType).join(" | ")}, got "${params.input}"`);
          return;
        }
        const inputContainer = getInputContainer(params.input);
        if (!inputContainer) {
          return;
        }
        const input = renderInputType[params.input](inputContainer, params);
        show(inputContainer);
        if (params.inputAutoFocus) {
          setTimeout(() => {
            focusInput(input);
          });
        }
      };
      const removeAttributes = (input) => {
        for (let i = 0; i < input.attributes.length; i++) {
          const attrName = input.attributes[i].name;
          if (!["id", "type", "value", "style"].includes(attrName)) {
            input.removeAttribute(attrName);
          }
        }
      };
      const setAttributes = (inputClass, inputAttributes) => {
        const popup = getPopup();
        if (!popup) {
          return;
        }
        const input = getInput$1(popup, inputClass);
        if (!input) {
          return;
        }
        removeAttributes(input);
        for (const attr in inputAttributes) {
          input.setAttribute(attr, inputAttributes[attr]);
        }
      };
      const setCustomClass = (params) => {
        if (!params.input) {
          return;
        }
        const inputContainer = getInputContainer(params.input);
        if (inputContainer) {
          applyCustomClass(inputContainer, params, "input");
        }
      };
      const setInputPlaceholder = (input, params) => {
        if (!input.placeholder && params.inputPlaceholder) {
          input.placeholder = params.inputPlaceholder;
        }
      };
      const setInputLabel = (input, prependTo, params) => {
        if (params.inputLabel) {
          const label = document.createElement("label");
          const labelClass = swalClasses["input-label"];
          label.setAttribute("for", input.id);
          label.className = labelClass;
          if (typeof params.customClass === "object") {
            addClass(label, params.customClass.inputLabel);
          }
          label.innerText = params.inputLabel;
          prependTo.insertAdjacentElement("beforebegin", label);
        }
      };
      const getInputContainer = (inputType) => {
        const popup = getPopup();
        if (!popup) {
          return;
        }
        return getDirectChildByClass(popup, swalClasses[
          /** @type {SwalClass} */
          inputType
        ] || swalClasses.input);
      };
      const checkAndSetInputValue = (input, inputValue) => {
        if (["string", "number"].includes(typeof inputValue)) {
          input.value = `${inputValue}`;
        } else if (!isPromise2(inputValue)) {
          warn(`Unexpected type of inputValue! Expected "string", "number" or "Promise", got "${typeof inputValue}"`);
        }
      };
      const renderInputType = {};
      renderInputType.text = renderInputType.email = renderInputType.password = renderInputType.number = renderInputType.tel = renderInputType.url = renderInputType.search = renderInputType.date = renderInputType["datetime-local"] = renderInputType.time = renderInputType.week = renderInputType.month = /** @type {(input: Input | HTMLElement, params: SweetAlertOptions) => Input} */
      (input, params) => {
        checkAndSetInputValue(input, params.inputValue);
        setInputLabel(input, input, params);
        setInputPlaceholder(input, params);
        input.type = params.input;
        return input;
      };
      renderInputType.file = (input, params) => {
        setInputLabel(input, input, params);
        setInputPlaceholder(input, params);
        return input;
      };
      renderInputType.range = (range, params) => {
        const rangeInput = range.querySelector("input");
        const rangeOutput = range.querySelector("output");
        checkAndSetInputValue(rangeInput, params.inputValue);
        rangeInput.type = params.input;
        checkAndSetInputValue(rangeOutput, params.inputValue);
        setInputLabel(rangeInput, range, params);
        return range;
      };
      renderInputType.select = (select, params) => {
        select.textContent = "";
        if (params.inputPlaceholder) {
          const placeholder = document.createElement("option");
          setInnerHtml(placeholder, params.inputPlaceholder);
          placeholder.value = "";
          placeholder.disabled = true;
          placeholder.selected = true;
          select.appendChild(placeholder);
        }
        setInputLabel(select, select, params);
        return select;
      };
      renderInputType.radio = (radio) => {
        radio.textContent = "";
        return radio;
      };
      renderInputType.checkbox = (checkboxContainer, params) => {
        const checkbox = getInput$1(getPopup(), "checkbox");
        checkbox.value = "1";
        checkbox.checked = Boolean(params.inputValue);
        const label = checkboxContainer.querySelector("span");
        setInnerHtml(label, params.inputPlaceholder || params.inputLabel);
        return checkbox;
      };
      renderInputType.textarea = (textarea, params) => {
        checkAndSetInputValue(textarea, params.inputValue);
        setInputPlaceholder(textarea, params);
        setInputLabel(textarea, textarea, params);
        const getMargin = (el) => parseInt(window.getComputedStyle(el).marginLeft) + parseInt(window.getComputedStyle(el).marginRight);
        setTimeout(() => {
          if ("MutationObserver" in window) {
            const initialPopupWidth = parseInt(window.getComputedStyle(getPopup()).width);
            const textareaResizeHandler = () => {
              if (!document.body.contains(textarea)) {
                return;
              }
              const textareaWidth = textarea.offsetWidth + getMargin(textarea);
              if (textareaWidth > initialPopupWidth) {
                getPopup().style.width = `${textareaWidth}px`;
              } else {
                applyNumericalStyle(getPopup(), "width", params.width);
              }
            };
            new MutationObserver(textareaResizeHandler).observe(textarea, {
              attributes: true,
              attributeFilter: ["style"]
            });
          }
        });
        return textarea;
      };
      const renderContent = (instance, params) => {
        const htmlContainer = getHtmlContainer();
        if (!htmlContainer) {
          return;
        }
        showWhenInnerHtmlPresent(htmlContainer);
        applyCustomClass(htmlContainer, params, "htmlContainer");
        if (params.html) {
          parseHtmlToContainer(params.html, htmlContainer);
          show(htmlContainer, "block");
        } else if (params.text) {
          htmlContainer.textContent = params.text;
          show(htmlContainer, "block");
        } else {
          hide(htmlContainer);
        }
        renderInput(instance, params);
      };
      const renderFooter = (instance, params) => {
        const footer = getFooter();
        if (!footer) {
          return;
        }
        showWhenInnerHtmlPresent(footer);
        toggle(footer, Boolean(params.footer), "block");
        if (params.footer) {
          parseHtmlToContainer(params.footer, footer);
        }
        applyCustomClass(footer, params, "footer");
      };
      const renderIcon = (instance, params) => {
        const innerParams = privateProps.innerParams.get(instance);
        const icon = getIcon();
        if (!icon) {
          return;
        }
        if (innerParams && params.icon === innerParams.icon) {
          setContent(icon, params);
          applyStyles(icon, params);
          return;
        }
        if (!params.icon && !params.iconHtml) {
          hide(icon);
          return;
        }
        if (params.icon && Object.keys(iconTypes).indexOf(params.icon) === -1) {
          error(`Unknown icon! Expected "success", "error", "warning", "info" or "question", got "${params.icon}"`);
          hide(icon);
          return;
        }
        show(icon);
        setContent(icon, params);
        applyStyles(icon, params);
        addClass(icon, params.showClass && params.showClass.icon);
        const colorSchemeQueryList = window.matchMedia("(prefers-color-scheme: dark)");
        colorSchemeQueryList.addEventListener("change", adjustSuccessIconBackgroundColor);
      };
      const applyStyles = (icon, params) => {
        for (const [iconType, iconClassName] of Object.entries(iconTypes)) {
          if (params.icon !== iconType) {
            removeClass(icon, iconClassName);
          }
        }
        addClass(icon, params.icon && iconTypes[params.icon]);
        setColor(icon, params);
        adjustSuccessIconBackgroundColor();
        applyCustomClass(icon, params, "icon");
      };
      const adjustSuccessIconBackgroundColor = () => {
        const popup = getPopup();
        if (!popup) {
          return;
        }
        const popupBackgroundColor = window.getComputedStyle(popup).getPropertyValue("background-color");
        const successIconParts = popup.querySelectorAll("[class^=swal2-success-circular-line], .swal2-success-fix");
        for (let i = 0; i < successIconParts.length; i++) {
          successIconParts[i].style.backgroundColor = popupBackgroundColor;
        }
      };
      const successIconHtml = (params) => `
  ${params.animation ? '<div class="swal2-success-circular-line-left"></div>' : ""}
  <span class="swal2-success-line-tip"></span> <span class="swal2-success-line-long"></span>
  <div class="swal2-success-ring"></div>
  ${params.animation ? '<div class="swal2-success-fix"></div>' : ""}
  ${params.animation ? '<div class="swal2-success-circular-line-right"></div>' : ""}
`;
      const errorIconHtml = `
  <span class="swal2-x-mark">
    <span class="swal2-x-mark-line-left"></span>
    <span class="swal2-x-mark-line-right"></span>
  </span>
`;
      const setContent = (icon, params) => {
        if (!params.icon && !params.iconHtml) {
          return;
        }
        let oldContent = icon.innerHTML;
        let newContent = "";
        if (params.iconHtml) {
          newContent = iconContent(params.iconHtml);
        } else if (params.icon === "success") {
          newContent = successIconHtml(params);
          oldContent = oldContent.replace(/ style=".*?"/g, "");
        } else if (params.icon === "error") {
          newContent = errorIconHtml;
        } else if (params.icon) {
          const defaultIconHtml = {
            question: "?",
            warning: "!",
            info: "i"
          };
          newContent = iconContent(defaultIconHtml[params.icon]);
        }
        if (oldContent.trim() !== newContent.trim()) {
          setInnerHtml(icon, newContent);
        }
      };
      const setColor = (icon, params) => {
        if (!params.iconColor) {
          return;
        }
        icon.style.color = params.iconColor;
        icon.style.borderColor = params.iconColor;
        for (const sel of [".swal2-success-line-tip", ".swal2-success-line-long", ".swal2-x-mark-line-left", ".swal2-x-mark-line-right"]) {
          setStyle(icon, sel, "background-color", params.iconColor);
        }
        setStyle(icon, ".swal2-success-ring", "border-color", params.iconColor);
      };
      const iconContent = (content) => `<div class="${swalClasses["icon-content"]}">${content}</div>`;
      const renderImage = (instance, params) => {
        const image = getImage();
        if (!image) {
          return;
        }
        if (!params.imageUrl) {
          hide(image);
          return;
        }
        show(image, "");
        image.setAttribute("src", params.imageUrl);
        image.setAttribute("alt", params.imageAlt || "");
        applyNumericalStyle(image, "width", params.imageWidth);
        applyNumericalStyle(image, "height", params.imageHeight);
        image.className = swalClasses.image;
        applyCustomClass(image, params, "image");
      };
      let dragging = false;
      let mousedownX = 0;
      let mousedownY = 0;
      let initialX = 0;
      let initialY = 0;
      const addDraggableListeners = (popup) => {
        popup.addEventListener("mousedown", down);
        document.body.addEventListener("mousemove", move);
        popup.addEventListener("mouseup", up);
        popup.addEventListener("touchstart", down);
        document.body.addEventListener("touchmove", move);
        popup.addEventListener("touchend", up);
      };
      const removeDraggableListeners = (popup) => {
        popup.removeEventListener("mousedown", down);
        document.body.removeEventListener("mousemove", move);
        popup.removeEventListener("mouseup", up);
        popup.removeEventListener("touchstart", down);
        document.body.removeEventListener("touchmove", move);
        popup.removeEventListener("touchend", up);
      };
      const down = (event) => {
        const popup = getPopup();
        if (event.target === popup || getIcon().contains(
          /** @type {HTMLElement} */
          event.target
        )) {
          dragging = true;
          const clientXY = getClientXY(event);
          mousedownX = clientXY.clientX;
          mousedownY = clientXY.clientY;
          initialX = parseInt(popup.style.insetInlineStart) || 0;
          initialY = parseInt(popup.style.insetBlockStart) || 0;
          addClass(popup, "swal2-dragging");
        }
      };
      const move = (event) => {
        const popup = getPopup();
        if (dragging) {
          let {
            clientX,
            clientY
          } = getClientXY(event);
          popup.style.insetInlineStart = `${initialX + (clientX - mousedownX)}px`;
          popup.style.insetBlockStart = `${initialY + (clientY - mousedownY)}px`;
        }
      };
      const up = () => {
        const popup = getPopup();
        dragging = false;
        removeClass(popup, "swal2-dragging");
      };
      const getClientXY = (event) => {
        let clientX = 0, clientY = 0;
        if (event.type.startsWith("mouse")) {
          clientX = /** @type {MouseEvent} */
          event.clientX;
          clientY = /** @type {MouseEvent} */
          event.clientY;
        } else if (event.type.startsWith("touch")) {
          clientX = /** @type {TouchEvent} */
          event.touches[0].clientX;
          clientY = /** @type {TouchEvent} */
          event.touches[0].clientY;
        }
        return {
          clientX,
          clientY
        };
      };
      const renderPopup = (instance, params) => {
        const container = getContainer();
        const popup = getPopup();
        if (!container || !popup) {
          return;
        }
        if (params.toast) {
          applyNumericalStyle(container, "width", params.width);
          popup.style.width = "100%";
          const loader = getLoader();
          if (loader) {
            popup.insertBefore(loader, getIcon());
          }
        } else {
          applyNumericalStyle(popup, "width", params.width);
        }
        applyNumericalStyle(popup, "padding", params.padding);
        if (params.color) {
          popup.style.color = params.color;
        }
        if (params.background) {
          popup.style.background = params.background;
        }
        hide(getValidationMessage());
        addClasses$1(popup, params);
        if (params.draggable && !params.toast) {
          addClass(popup, swalClasses.draggable);
          addDraggableListeners(popup);
        } else {
          removeClass(popup, swalClasses.draggable);
          removeDraggableListeners(popup);
        }
      };
      const addClasses$1 = (popup, params) => {
        const showClass = params.showClass || {};
        popup.className = `${swalClasses.popup} ${isVisible$1(popup) ? showClass.popup : ""}`;
        if (params.toast) {
          addClass([document.documentElement, document.body], swalClasses["toast-shown"]);
          addClass(popup, swalClasses.toast);
        } else {
          addClass(popup, swalClasses.modal);
        }
        applyCustomClass(popup, params, "popup");
        if (typeof params.customClass === "string") {
          addClass(popup, params.customClass);
        }
        if (params.icon) {
          addClass(popup, swalClasses[`icon-${params.icon}`]);
        }
      };
      const renderProgressSteps = (instance, params) => {
        const progressStepsContainer = getProgressSteps();
        if (!progressStepsContainer) {
          return;
        }
        const {
          progressSteps,
          currentProgressStep
        } = params;
        if (!progressSteps || progressSteps.length === 0 || currentProgressStep === void 0) {
          hide(progressStepsContainer);
          return;
        }
        show(progressStepsContainer);
        progressStepsContainer.textContent = "";
        if (currentProgressStep >= progressSteps.length) {
          warn("Invalid currentProgressStep parameter, it should be less than progressSteps.length (currentProgressStep like JS arrays starts from 0)");
        }
        progressSteps.forEach((step, index) => {
          const stepEl = createStepElement(step);
          progressStepsContainer.appendChild(stepEl);
          if (index === currentProgressStep) {
            addClass(stepEl, swalClasses["active-progress-step"]);
          }
          if (index !== progressSteps.length - 1) {
            const lineEl = createLineElement(params);
            progressStepsContainer.appendChild(lineEl);
          }
        });
      };
      const createStepElement = (step) => {
        const stepEl = document.createElement("li");
        addClass(stepEl, swalClasses["progress-step"]);
        setInnerHtml(stepEl, step);
        return stepEl;
      };
      const createLineElement = (params) => {
        const lineEl = document.createElement("li");
        addClass(lineEl, swalClasses["progress-step-line"]);
        if (params.progressStepsDistance) {
          applyNumericalStyle(lineEl, "width", params.progressStepsDistance);
        }
        return lineEl;
      };
      const renderTitle = (instance, params) => {
        const title = getTitle();
        if (!title) {
          return;
        }
        showWhenInnerHtmlPresent(title);
        toggle(title, Boolean(params.title || params.titleText), "block");
        if (params.title) {
          parseHtmlToContainer(params.title, title);
        }
        if (params.titleText) {
          title.innerText = params.titleText;
        }
        applyCustomClass(title, params, "title");
      };
      const render = (instance, params) => {
        renderPopup(instance, params);
        renderContainer(instance, params);
        renderProgressSteps(instance, params);
        renderIcon(instance, params);
        renderImage(instance, params);
        renderTitle(instance, params);
        renderCloseButton(instance, params);
        renderContent(instance, params);
        renderActions(instance, params);
        renderFooter(instance, params);
        const popup = getPopup();
        if (typeof params.didRender === "function" && popup) {
          params.didRender(popup);
        }
        globalState.eventEmitter.emit("didRender", popup);
      };
      const isVisible = () => {
        return isVisible$1(getPopup());
      };
      const clickConfirm = () => {
        var _dom$getConfirmButton;
        return (_dom$getConfirmButton = getConfirmButton()) === null || _dom$getConfirmButton === void 0 ? void 0 : _dom$getConfirmButton.click();
      };
      const clickDeny = () => {
        var _dom$getDenyButton;
        return (_dom$getDenyButton = getDenyButton()) === null || _dom$getDenyButton === void 0 ? void 0 : _dom$getDenyButton.click();
      };
      const clickCancel = () => {
        var _dom$getCancelButton;
        return (_dom$getCancelButton = getCancelButton()) === null || _dom$getCancelButton === void 0 ? void 0 : _dom$getCancelButton.click();
      };
      const DismissReason = Object.freeze({
        cancel: "cancel",
        backdrop: "backdrop",
        close: "close",
        esc: "esc",
        timer: "timer"
      });
      const removeKeydownHandler = (globalState2) => {
        if (globalState2.keydownTarget && globalState2.keydownHandlerAdded) {
          globalState2.keydownTarget.removeEventListener("keydown", globalState2.keydownHandler, {
            capture: globalState2.keydownListenerCapture
          });
          globalState2.keydownHandlerAdded = false;
        }
      };
      const addKeydownHandler = (globalState2, innerParams, dismissWith) => {
        removeKeydownHandler(globalState2);
        if (!innerParams.toast) {
          globalState2.keydownHandler = (e) => keydownHandler(innerParams, e, dismissWith);
          globalState2.keydownTarget = innerParams.keydownListenerCapture ? window : getPopup();
          globalState2.keydownListenerCapture = innerParams.keydownListenerCapture;
          globalState2.keydownTarget.addEventListener("keydown", globalState2.keydownHandler, {
            capture: globalState2.keydownListenerCapture
          });
          globalState2.keydownHandlerAdded = true;
        }
      };
      const setFocus = (index, increment) => {
        var _dom$getPopup;
        const focusableElements = getFocusableElements();
        if (focusableElements.length) {
          index = index + increment;
          if (index === -2) {
            index = focusableElements.length - 1;
          }
          if (index === focusableElements.length) {
            index = 0;
          } else if (index === -1) {
            index = focusableElements.length - 1;
          }
          focusableElements[index].focus();
          return;
        }
        (_dom$getPopup = getPopup()) === null || _dom$getPopup === void 0 || _dom$getPopup.focus();
      };
      const arrowKeysNextButton = ["ArrowRight", "ArrowDown"];
      const arrowKeysPreviousButton = ["ArrowLeft", "ArrowUp"];
      const keydownHandler = (innerParams, event, dismissWith) => {
        if (!innerParams) {
          return;
        }
        if (event.isComposing || event.keyCode === 229) {
          return;
        }
        if (innerParams.stopKeydownPropagation) {
          event.stopPropagation();
        }
        if (event.key === "Enter") {
          handleEnter(event, innerParams);
        } else if (event.key === "Tab") {
          handleTab(event);
        } else if ([...arrowKeysNextButton, ...arrowKeysPreviousButton].includes(event.key)) {
          handleArrows(event.key);
        } else if (event.key === "Escape") {
          handleEsc(event, innerParams, dismissWith);
        }
      };
      const handleEnter = (event, innerParams) => {
        if (!callIfFunction(innerParams.allowEnterKey)) {
          return;
        }
        const input = getInput$1(getPopup(), innerParams.input);
        if (event.target && input && event.target instanceof HTMLElement && event.target.outerHTML === input.outerHTML) {
          if (["textarea", "file"].includes(innerParams.input)) {
            return;
          }
          clickConfirm();
          event.preventDefault();
        }
      };
      const handleTab = (event) => {
        const targetElement = event.target;
        const focusableElements = getFocusableElements();
        let btnIndex = -1;
        for (let i = 0; i < focusableElements.length; i++) {
          if (targetElement === focusableElements[i]) {
            btnIndex = i;
            break;
          }
        }
        if (!event.shiftKey) {
          setFocus(btnIndex, 1);
        } else {
          setFocus(btnIndex, -1);
        }
        event.stopPropagation();
        event.preventDefault();
      };
      const handleArrows = (key) => {
        const actions = getActions();
        const confirmButton = getConfirmButton();
        const denyButton = getDenyButton();
        const cancelButton = getCancelButton();
        if (!actions || !confirmButton || !denyButton || !cancelButton) {
          return;
        }
        const buttons = [confirmButton, denyButton, cancelButton];
        if (document.activeElement instanceof HTMLElement && !buttons.includes(document.activeElement)) {
          return;
        }
        const sibling = arrowKeysNextButton.includes(key) ? "nextElementSibling" : "previousElementSibling";
        let buttonToFocus = document.activeElement;
        if (!buttonToFocus) {
          return;
        }
        for (let i = 0; i < actions.children.length; i++) {
          buttonToFocus = buttonToFocus[sibling];
          if (!buttonToFocus) {
            return;
          }
          if (buttonToFocus instanceof HTMLButtonElement && isVisible$1(buttonToFocus)) {
            break;
          }
        }
        if (buttonToFocus instanceof HTMLButtonElement) {
          buttonToFocus.focus();
        }
      };
      const handleEsc = (event, innerParams, dismissWith) => {
        event.preventDefault();
        if (callIfFunction(innerParams.allowEscapeKey)) {
          dismissWith(DismissReason.esc);
        }
      };
      var privateMethods = {
        swalPromiseResolve: /* @__PURE__ */ new WeakMap(),
        swalPromiseReject: /* @__PURE__ */ new WeakMap()
      };
      const setAriaHidden = () => {
        const container = getContainer();
        const bodyChildren = Array.from(document.body.children);
        bodyChildren.forEach((el) => {
          if (el.contains(container)) {
            return;
          }
          if (el.hasAttribute("aria-hidden")) {
            el.setAttribute("data-previous-aria-hidden", el.getAttribute("aria-hidden") || "");
          }
          el.setAttribute("aria-hidden", "true");
        });
      };
      const unsetAriaHidden = () => {
        const bodyChildren = Array.from(document.body.children);
        bodyChildren.forEach((el) => {
          if (el.hasAttribute("data-previous-aria-hidden")) {
            el.setAttribute("aria-hidden", el.getAttribute("data-previous-aria-hidden") || "");
            el.removeAttribute("data-previous-aria-hidden");
          } else {
            el.removeAttribute("aria-hidden");
          }
        });
      };
      const isSafariOrIOS = typeof window !== "undefined" && !!window.GestureEvent;
      const iOSfix = () => {
        if (isSafariOrIOS && !hasClass(document.body, swalClasses.iosfix)) {
          const offset = document.body.scrollTop;
          document.body.style.top = `${offset * -1}px`;
          addClass(document.body, swalClasses.iosfix);
          lockBodyScroll();
        }
      };
      const lockBodyScroll = () => {
        const container = getContainer();
        if (!container) {
          return;
        }
        let preventTouchMove;
        container.ontouchstart = (event) => {
          preventTouchMove = shouldPreventTouchMove(event);
        };
        container.ontouchmove = (event) => {
          if (preventTouchMove) {
            event.preventDefault();
            event.stopPropagation();
          }
        };
      };
      const shouldPreventTouchMove = (event) => {
        const target = event.target;
        const container = getContainer();
        const htmlContainer = getHtmlContainer();
        if (!container || !htmlContainer) {
          return false;
        }
        if (isStylus(event) || isZoom(event)) {
          return false;
        }
        if (target === container) {
          return true;
        }
        if (!isScrollable(container) && target instanceof HTMLElement && !selfOrParentIsScrollable(target, htmlContainer) && // #2823
        target.tagName !== "INPUT" && // #1603
        target.tagName !== "TEXTAREA" && // #2266
        !(isScrollable(htmlContainer) && // #1944
        htmlContainer.contains(target))) {
          return true;
        }
        return false;
      };
      const isStylus = (event) => {
        return event.touches && event.touches.length && event.touches[0].touchType === "stylus";
      };
      const isZoom = (event) => {
        return event.touches && event.touches.length > 1;
      };
      const undoIOSfix = () => {
        if (hasClass(document.body, swalClasses.iosfix)) {
          const offset = parseInt(document.body.style.top, 10);
          removeClass(document.body, swalClasses.iosfix);
          document.body.style.top = "";
          document.body.scrollTop = offset * -1;
        }
      };
      const measureScrollbar = () => {
        const scrollDiv = document.createElement("div");
        scrollDiv.className = swalClasses["scrollbar-measure"];
        document.body.appendChild(scrollDiv);
        const scrollbarWidth = scrollDiv.getBoundingClientRect().width - scrollDiv.clientWidth;
        document.body.removeChild(scrollDiv);
        return scrollbarWidth;
      };
      let previousBodyPadding = null;
      const replaceScrollbarWithPadding = (initialBodyOverflow) => {
        if (previousBodyPadding !== null) {
          return;
        }
        if (document.body.scrollHeight > window.innerHeight || initialBodyOverflow === "scroll") {
          previousBodyPadding = parseInt(window.getComputedStyle(document.body).getPropertyValue("padding-right"));
          document.body.style.paddingRight = `${previousBodyPadding + measureScrollbar()}px`;
        }
      };
      const undoReplaceScrollbarWithPadding = () => {
        if (previousBodyPadding !== null) {
          document.body.style.paddingRight = `${previousBodyPadding}px`;
          previousBodyPadding = null;
        }
      };
      function removePopupAndResetState(instance, container, returnFocus, didClose) {
        if (isToast()) {
          triggerDidCloseAndDispose(instance, didClose);
        } else {
          restoreActiveElement(returnFocus).then(() => triggerDidCloseAndDispose(instance, didClose));
          removeKeydownHandler(globalState);
        }
        if (isSafariOrIOS) {
          container.setAttribute("style", "display:none !important");
          container.removeAttribute("class");
          container.innerHTML = "";
        } else {
          container.remove();
        }
        if (isModal()) {
          undoReplaceScrollbarWithPadding();
          undoIOSfix();
          unsetAriaHidden();
        }
        removeBodyClasses();
      }
      function removeBodyClasses() {
        removeClass([document.documentElement, document.body], [swalClasses.shown, swalClasses["height-auto"], swalClasses["no-backdrop"], swalClasses["toast-shown"]]);
      }
      function close(resolveValue) {
        resolveValue = prepareResolveValue(resolveValue);
        const swalPromiseResolve = privateMethods.swalPromiseResolve.get(this);
        const didClose = triggerClosePopup(this);
        if (this.isAwaitingPromise) {
          if (!resolveValue.isDismissed) {
            handleAwaitingPromise(this);
            swalPromiseResolve(resolveValue);
          }
        } else if (didClose) {
          swalPromiseResolve(resolveValue);
        }
      }
      const triggerClosePopup = (instance) => {
        const popup = getPopup();
        if (!popup) {
          return false;
        }
        const innerParams = privateProps.innerParams.get(instance);
        if (!innerParams || hasClass(popup, innerParams.hideClass.popup)) {
          return false;
        }
        removeClass(popup, innerParams.showClass.popup);
        addClass(popup, innerParams.hideClass.popup);
        const backdrop = getContainer();
        removeClass(backdrop, innerParams.showClass.backdrop);
        addClass(backdrop, innerParams.hideClass.backdrop);
        handlePopupAnimation(instance, popup, innerParams);
        return true;
      };
      function rejectPromise(error2) {
        const rejectPromise2 = privateMethods.swalPromiseReject.get(this);
        handleAwaitingPromise(this);
        if (rejectPromise2) {
          rejectPromise2(error2);
        }
      }
      const handleAwaitingPromise = (instance) => {
        if (instance.isAwaitingPromise) {
          delete instance.isAwaitingPromise;
          if (!privateProps.innerParams.get(instance)) {
            instance._destroy();
          }
        }
      };
      const prepareResolveValue = (resolveValue) => {
        if (typeof resolveValue === "undefined") {
          return {
            isConfirmed: false,
            isDenied: false,
            isDismissed: true
          };
        }
        return Object.assign({
          isConfirmed: false,
          isDenied: false,
          isDismissed: false
        }, resolveValue);
      };
      const handlePopupAnimation = (instance, popup, innerParams) => {
        var _globalState$eventEmi;
        const container = getContainer();
        const animationIsSupported = hasCssAnimation(popup);
        if (typeof innerParams.willClose === "function") {
          innerParams.willClose(popup);
        }
        (_globalState$eventEmi = globalState.eventEmitter) === null || _globalState$eventEmi === void 0 || _globalState$eventEmi.emit("willClose", popup);
        if (animationIsSupported) {
          animatePopup(instance, popup, container, innerParams.returnFocus, innerParams.didClose);
        } else {
          removePopupAndResetState(instance, container, innerParams.returnFocus, innerParams.didClose);
        }
      };
      const animatePopup = (instance, popup, container, returnFocus, didClose) => {
        globalState.swalCloseEventFinishedCallback = removePopupAndResetState.bind(null, instance, container, returnFocus, didClose);
        const swalCloseAnimationFinished = function(e) {
          if (e.target === popup) {
            var _globalState$swalClos;
            (_globalState$swalClos = globalState.swalCloseEventFinishedCallback) === null || _globalState$swalClos === void 0 || _globalState$swalClos.call(globalState);
            delete globalState.swalCloseEventFinishedCallback;
            popup.removeEventListener("animationend", swalCloseAnimationFinished);
            popup.removeEventListener("transitionend", swalCloseAnimationFinished);
          }
        };
        popup.addEventListener("animationend", swalCloseAnimationFinished);
        popup.addEventListener("transitionend", swalCloseAnimationFinished);
      };
      const triggerDidCloseAndDispose = (instance, didClose) => {
        setTimeout(() => {
          var _globalState$eventEmi2;
          if (typeof didClose === "function") {
            didClose.bind(instance.params)();
          }
          (_globalState$eventEmi2 = globalState.eventEmitter) === null || _globalState$eventEmi2 === void 0 || _globalState$eventEmi2.emit("didClose");
          if (instance._destroy) {
            instance._destroy();
          }
        });
      };
      const showLoading = (buttonToReplace) => {
        let popup = getPopup();
        if (!popup) {
          new Swal();
        }
        popup = getPopup();
        if (!popup) {
          return;
        }
        const loader = getLoader();
        if (isToast()) {
          hide(getIcon());
        } else {
          replaceButton(popup, buttonToReplace);
        }
        show(loader);
        popup.setAttribute("data-loading", "true");
        popup.setAttribute("aria-busy", "true");
        popup.focus();
      };
      const replaceButton = (popup, buttonToReplace) => {
        const actions = getActions();
        const loader = getLoader();
        if (!actions || !loader) {
          return;
        }
        if (!buttonToReplace && isVisible$1(getConfirmButton())) {
          buttonToReplace = getConfirmButton();
        }
        show(actions);
        if (buttonToReplace) {
          hide(buttonToReplace);
          loader.setAttribute("data-button-to-replace", buttonToReplace.className);
          actions.insertBefore(loader, buttonToReplace);
        }
        addClass([popup, actions], swalClasses.loading);
      };
      const handleInputOptionsAndValue = (instance, params) => {
        if (params.input === "select" || params.input === "radio") {
          handleInputOptions(instance, params);
        } else if (["text", "email", "number", "tel", "textarea"].some((i) => i === params.input) && (hasToPromiseFn(params.inputValue) || isPromise2(params.inputValue))) {
          showLoading(getConfirmButton());
          handleInputValue(instance, params);
        }
      };
      const getInputValue = (instance, innerParams) => {
        const input = instance.getInput();
        if (!input) {
          return null;
        }
        switch (innerParams.input) {
          case "checkbox":
            return getCheckboxValue(input);
          case "radio":
            return getRadioValue(input);
          case "file":
            return getFileValue(input);
          default:
            return innerParams.inputAutoTrim ? input.value.trim() : input.value;
        }
      };
      const getCheckboxValue = (input) => input.checked ? 1 : 0;
      const getRadioValue = (input) => input.checked ? input.value : null;
      const getFileValue = (input) => input.files && input.files.length ? input.getAttribute("multiple") !== null ? input.files : input.files[0] : null;
      const handleInputOptions = (instance, params) => {
        const popup = getPopup();
        if (!popup) {
          return;
        }
        const processInputOptions = (inputOptions) => {
          if (params.input === "select") {
            populateSelectOptions(popup, formatInputOptions(inputOptions), params);
          } else if (params.input === "radio") {
            populateRadioOptions(popup, formatInputOptions(inputOptions), params);
          }
        };
        if (hasToPromiseFn(params.inputOptions) || isPromise2(params.inputOptions)) {
          showLoading(getConfirmButton());
          asPromise(params.inputOptions).then((inputOptions) => {
            instance.hideLoading();
            processInputOptions(inputOptions);
          });
        } else if (typeof params.inputOptions === "object") {
          processInputOptions(params.inputOptions);
        } else {
          error(`Unexpected type of inputOptions! Expected object, Map or Promise, got ${typeof params.inputOptions}`);
        }
      };
      const handleInputValue = (instance, params) => {
        const input = instance.getInput();
        if (!input) {
          return;
        }
        hide(input);
        asPromise(params.inputValue).then((inputValue) => {
          input.value = params.input === "number" ? `${parseFloat(inputValue) || 0}` : `${inputValue}`;
          show(input);
          input.focus();
          instance.hideLoading();
        }).catch((err) => {
          error(`Error in inputValue promise: ${err}`);
          input.value = "";
          show(input);
          input.focus();
          instance.hideLoading();
        });
      };
      function populateSelectOptions(popup, inputOptions, params) {
        const select = getDirectChildByClass(popup, swalClasses.select);
        if (!select) {
          return;
        }
        const renderOption = (parent, optionLabel, optionValue) => {
          const option = document.createElement("option");
          option.value = optionValue;
          setInnerHtml(option, optionLabel);
          option.selected = isSelected(optionValue, params.inputValue);
          parent.appendChild(option);
        };
        inputOptions.forEach((inputOption) => {
          const optionValue = inputOption[0];
          const optionLabel = inputOption[1];
          if (Array.isArray(optionLabel)) {
            const optgroup = document.createElement("optgroup");
            optgroup.label = optionValue;
            optgroup.disabled = false;
            select.appendChild(optgroup);
            optionLabel.forEach((o) => renderOption(optgroup, o[1], o[0]));
          } else {
            renderOption(select, optionLabel, optionValue);
          }
        });
        select.focus();
      }
      function populateRadioOptions(popup, inputOptions, params) {
        const radio = getDirectChildByClass(popup, swalClasses.radio);
        if (!radio) {
          return;
        }
        inputOptions.forEach((inputOption) => {
          const radioValue = inputOption[0];
          const radioLabel = inputOption[1];
          const radioInput = document.createElement("input");
          const radioLabelElement = document.createElement("label");
          radioInput.type = "radio";
          radioInput.name = swalClasses.radio;
          radioInput.value = radioValue;
          if (isSelected(radioValue, params.inputValue)) {
            radioInput.checked = true;
          }
          const label = document.createElement("span");
          setInnerHtml(label, radioLabel);
          label.className = swalClasses.label;
          radioLabelElement.appendChild(radioInput);
          radioLabelElement.appendChild(label);
          radio.appendChild(radioLabelElement);
        });
        const radios = radio.querySelectorAll("input");
        if (radios.length) {
          radios[0].focus();
        }
      }
      const formatInputOptions = (inputOptions) => {
        const result = [];
        if (inputOptions instanceof Map) {
          inputOptions.forEach((value, key) => {
            let valueFormatted = value;
            if (typeof valueFormatted === "object") {
              valueFormatted = formatInputOptions(valueFormatted);
            }
            result.push([key, valueFormatted]);
          });
        } else {
          Object.keys(inputOptions).forEach((key) => {
            let valueFormatted = inputOptions[key];
            if (typeof valueFormatted === "object") {
              valueFormatted = formatInputOptions(valueFormatted);
            }
            result.push([key, valueFormatted]);
          });
        }
        return result;
      };
      const isSelected = (optionValue, inputValue) => {
        return !!inputValue && inputValue.toString() === optionValue.toString();
      };
      const handleConfirmButtonClick = (instance) => {
        const innerParams = privateProps.innerParams.get(instance);
        instance.disableButtons();
        if (innerParams.input) {
          handleConfirmOrDenyWithInput(instance, "confirm");
        } else {
          confirm(instance, true);
        }
      };
      const handleDenyButtonClick = (instance) => {
        const innerParams = privateProps.innerParams.get(instance);
        instance.disableButtons();
        if (innerParams.returnInputValueOnDeny) {
          handleConfirmOrDenyWithInput(instance, "deny");
        } else {
          deny(instance, false);
        }
      };
      const handleCancelButtonClick = (instance, dismissWith) => {
        instance.disableButtons();
        dismissWith(DismissReason.cancel);
      };
      const handleConfirmOrDenyWithInput = (instance, type) => {
        const innerParams = privateProps.innerParams.get(instance);
        if (!innerParams.input) {
          error(`The "input" parameter is needed to be set when using returnInputValueOn${capitalizeFirstLetter(type)}`);
          return;
        }
        const input = instance.getInput();
        const inputValue = getInputValue(instance, innerParams);
        if (innerParams.inputValidator) {
          handleInputValidator(instance, inputValue, type);
        } else if (input && !input.checkValidity()) {
          instance.enableButtons();
          instance.showValidationMessage(innerParams.validationMessage || input.validationMessage);
        } else if (type === "deny") {
          deny(instance, inputValue);
        } else {
          confirm(instance, inputValue);
        }
      };
      const handleInputValidator = (instance, inputValue, type) => {
        const innerParams = privateProps.innerParams.get(instance);
        instance.disableInput();
        const validationPromise = Promise.resolve().then(() => asPromise(innerParams.inputValidator(inputValue, innerParams.validationMessage)));
        validationPromise.then((validationMessage) => {
          instance.enableButtons();
          instance.enableInput();
          if (validationMessage) {
            instance.showValidationMessage(validationMessage);
          } else if (type === "deny") {
            deny(instance, inputValue);
          } else {
            confirm(instance, inputValue);
          }
        });
      };
      const deny = (instance, value) => {
        const innerParams = privateProps.innerParams.get(instance || void 0);
        if (innerParams.showLoaderOnDeny) {
          showLoading(getDenyButton());
        }
        if (innerParams.preDeny) {
          instance.isAwaitingPromise = true;
          const preDenyPromise = Promise.resolve().then(() => asPromise(innerParams.preDeny(value, innerParams.validationMessage)));
          preDenyPromise.then((preDenyValue) => {
            if (preDenyValue === false) {
              instance.hideLoading();
              handleAwaitingPromise(instance);
            } else {
              instance.close(
                /** @type SweetAlertResult */
                {
                  isDenied: true,
                  value: typeof preDenyValue === "undefined" ? value : preDenyValue
                }
              );
            }
          }).catch((error2) => rejectWith(instance || void 0, error2));
        } else {
          instance.close(
            /** @type SweetAlertResult */
            {
              isDenied: true,
              value
            }
          );
        }
      };
      const succeedWith = (instance, value) => {
        instance.close(
          /** @type SweetAlertResult */
          {
            isConfirmed: true,
            value
          }
        );
      };
      const rejectWith = (instance, error2) => {
        instance.rejectPromise(error2);
      };
      const confirm = (instance, value) => {
        const innerParams = privateProps.innerParams.get(instance || void 0);
        if (innerParams.showLoaderOnConfirm) {
          showLoading();
        }
        if (innerParams.preConfirm) {
          instance.resetValidationMessage();
          instance.isAwaitingPromise = true;
          const preConfirmPromise = Promise.resolve().then(() => asPromise(innerParams.preConfirm(value, innerParams.validationMessage)));
          preConfirmPromise.then((preConfirmValue) => {
            if (isVisible$1(getValidationMessage()) || preConfirmValue === false) {
              instance.hideLoading();
              handleAwaitingPromise(instance);
            } else {
              succeedWith(instance, typeof preConfirmValue === "undefined" ? value : preConfirmValue);
            }
          }).catch((error2) => rejectWith(instance || void 0, error2));
        } else {
          succeedWith(instance, value);
        }
      };
      function hideLoading() {
        const innerParams = privateProps.innerParams.get(this);
        if (!innerParams) {
          return;
        }
        const domCache = privateProps.domCache.get(this);
        hide(domCache.loader);
        if (isToast()) {
          if (innerParams.icon) {
            show(getIcon());
          }
        } else {
          showRelatedButton(domCache);
        }
        removeClass([domCache.popup, domCache.actions], swalClasses.loading);
        domCache.popup.removeAttribute("aria-busy");
        domCache.popup.removeAttribute("data-loading");
        domCache.confirmButton.disabled = false;
        domCache.denyButton.disabled = false;
        domCache.cancelButton.disabled = false;
      }
      const showRelatedButton = (domCache) => {
        const buttonToReplace = domCache.popup.getElementsByClassName(domCache.loader.getAttribute("data-button-to-replace"));
        if (buttonToReplace.length) {
          show(buttonToReplace[0], "inline-block");
        } else if (allButtonsAreHidden()) {
          hide(domCache.actions);
        }
      };
      function getInput() {
        const innerParams = privateProps.innerParams.get(this);
        const domCache = privateProps.domCache.get(this);
        if (!domCache) {
          return null;
        }
        return getInput$1(domCache.popup, innerParams.input);
      }
      function setButtonsDisabled(instance, buttons, disabled) {
        const domCache = privateProps.domCache.get(instance);
        buttons.forEach((button) => {
          domCache[button].disabled = disabled;
        });
      }
      function setInputDisabled(input, disabled) {
        const popup = getPopup();
        if (!popup || !input) {
          return;
        }
        if (input.type === "radio") {
          const radios = popup.querySelectorAll(`[name="${swalClasses.radio}"]`);
          for (let i = 0; i < radios.length; i++) {
            radios[i].disabled = disabled;
          }
        } else {
          input.disabled = disabled;
        }
      }
      function enableButtons() {
        setButtonsDisabled(this, ["confirmButton", "denyButton", "cancelButton"], false);
      }
      function disableButtons() {
        setButtonsDisabled(this, ["confirmButton", "denyButton", "cancelButton"], true);
      }
      function enableInput() {
        setInputDisabled(this.getInput(), false);
      }
      function disableInput() {
        setInputDisabled(this.getInput(), true);
      }
      function showValidationMessage(error2) {
        const domCache = privateProps.domCache.get(this);
        const params = privateProps.innerParams.get(this);
        setInnerHtml(domCache.validationMessage, error2);
        domCache.validationMessage.className = swalClasses["validation-message"];
        if (params.customClass && params.customClass.validationMessage) {
          addClass(domCache.validationMessage, params.customClass.validationMessage);
        }
        show(domCache.validationMessage);
        const input = this.getInput();
        if (input) {
          input.setAttribute("aria-invalid", "true");
          input.setAttribute("aria-describedby", swalClasses["validation-message"]);
          focusInput(input);
          addClass(input, swalClasses.inputerror);
        }
      }
      function resetValidationMessage() {
        const domCache = privateProps.domCache.get(this);
        if (domCache.validationMessage) {
          hide(domCache.validationMessage);
        }
        const input = this.getInput();
        if (input) {
          input.removeAttribute("aria-invalid");
          input.removeAttribute("aria-describedby");
          removeClass(input, swalClasses.inputerror);
        }
      }
      const defaultParams = {
        title: "",
        titleText: "",
        text: "",
        html: "",
        footer: "",
        icon: void 0,
        iconColor: void 0,
        iconHtml: void 0,
        template: void 0,
        toast: false,
        draggable: false,
        animation: true,
        theme: "light",
        showClass: {
          popup: "swal2-show",
          backdrop: "swal2-backdrop-show",
          icon: "swal2-icon-show"
        },
        hideClass: {
          popup: "swal2-hide",
          backdrop: "swal2-backdrop-hide",
          icon: "swal2-icon-hide"
        },
        customClass: {},
        target: "body",
        color: void 0,
        backdrop: true,
        heightAuto: true,
        allowOutsideClick: true,
        allowEscapeKey: true,
        allowEnterKey: true,
        stopKeydownPropagation: true,
        keydownListenerCapture: false,
        showConfirmButton: true,
        showDenyButton: false,
        showCancelButton: false,
        preConfirm: void 0,
        preDeny: void 0,
        confirmButtonText: "OK",
        confirmButtonAriaLabel: "",
        confirmButtonColor: void 0,
        denyButtonText: "No",
        denyButtonAriaLabel: "",
        denyButtonColor: void 0,
        cancelButtonText: "Cancel",
        cancelButtonAriaLabel: "",
        cancelButtonColor: void 0,
        buttonsStyling: true,
        reverseButtons: false,
        focusConfirm: true,
        focusDeny: false,
        focusCancel: false,
        returnFocus: true,
        showCloseButton: false,
        closeButtonHtml: "&times;",
        closeButtonAriaLabel: "Close this dialog",
        loaderHtml: "",
        showLoaderOnConfirm: false,
        showLoaderOnDeny: false,
        imageUrl: void 0,
        imageWidth: void 0,
        imageHeight: void 0,
        imageAlt: "",
        timer: void 0,
        timerProgressBar: false,
        width: void 0,
        padding: void 0,
        background: void 0,
        input: void 0,
        inputPlaceholder: "",
        inputLabel: "",
        inputValue: "",
        inputOptions: {},
        inputAutoFocus: true,
        inputAutoTrim: true,
        inputAttributes: {},
        inputValidator: void 0,
        returnInputValueOnDeny: false,
        validationMessage: void 0,
        grow: false,
        position: "center",
        progressSteps: [],
        currentProgressStep: void 0,
        progressStepsDistance: void 0,
        willOpen: void 0,
        didOpen: void 0,
        didRender: void 0,
        willClose: void 0,
        didClose: void 0,
        didDestroy: void 0,
        scrollbarPadding: true,
        topLayer: false
      };
      const updatableParams = ["allowEscapeKey", "allowOutsideClick", "background", "buttonsStyling", "cancelButtonAriaLabel", "cancelButtonColor", "cancelButtonText", "closeButtonAriaLabel", "closeButtonHtml", "color", "confirmButtonAriaLabel", "confirmButtonColor", "confirmButtonText", "currentProgressStep", "customClass", "denyButtonAriaLabel", "denyButtonColor", "denyButtonText", "didClose", "didDestroy", "draggable", "footer", "hideClass", "html", "icon", "iconColor", "iconHtml", "imageAlt", "imageHeight", "imageUrl", "imageWidth", "preConfirm", "preDeny", "progressSteps", "returnFocus", "reverseButtons", "showCancelButton", "showCloseButton", "showConfirmButton", "showDenyButton", "text", "title", "titleText", "theme", "willClose"];
      const deprecatedParams = {
        allowEnterKey: void 0
      };
      const toastIncompatibleParams = ["allowOutsideClick", "allowEnterKey", "backdrop", "draggable", "focusConfirm", "focusDeny", "focusCancel", "returnFocus", "heightAuto", "keydownListenerCapture"];
      const isValidParameter = (paramName) => {
        return Object.prototype.hasOwnProperty.call(defaultParams, paramName);
      };
      const isUpdatableParameter = (paramName) => {
        return updatableParams.indexOf(paramName) !== -1;
      };
      const isDeprecatedParameter = (paramName) => {
        return deprecatedParams[paramName];
      };
      const checkIfParamIsValid = (param) => {
        if (!isValidParameter(param)) {
          warn(`Unknown parameter "${param}"`);
        }
      };
      const checkIfToastParamIsValid = (param) => {
        if (toastIncompatibleParams.includes(param)) {
          warn(`The parameter "${param}" is incompatible with toasts`);
        }
      };
      const checkIfParamIsDeprecated = (param) => {
        const isDeprecated = isDeprecatedParameter(param);
        if (isDeprecated) {
          warnAboutDeprecation(param, isDeprecated);
        }
      };
      const showWarningsForParams = (params) => {
        if (params.backdrop === false && params.allowOutsideClick) {
          warn('"allowOutsideClick" parameter requires `backdrop` parameter to be set to `true`');
        }
        if (params.theme && !["light", "dark", "auto", "minimal", "borderless", "bootstrap-4", "bootstrap-4-light", "bootstrap-4-dark", "bootstrap-5", "bootstrap-5-light", "bootstrap-5-dark", "material-ui", "material-ui-light", "material-ui-dark", "embed-iframe", "bulma", "bulma-light", "bulma-dark"].includes(params.theme)) {
          warn(`Invalid theme "${params.theme}"`);
        }
        for (const param in params) {
          checkIfParamIsValid(param);
          if (params.toast) {
            checkIfToastParamIsValid(param);
          }
          checkIfParamIsDeprecated(param);
        }
      };
      function update(params) {
        const container = getContainer();
        const popup = getPopup();
        const innerParams = privateProps.innerParams.get(this);
        if (!popup || hasClass(popup, innerParams.hideClass.popup)) {
          warn(`You're trying to update the closed or closing popup, that won't work. Use the update() method in preConfirm parameter or show a new popup.`);
          return;
        }
        const validUpdatableParams = filterValidParams(params);
        const updatedParams = Object.assign({}, innerParams, validUpdatableParams);
        showWarningsForParams(updatedParams);
        container.dataset["swal2Theme"] = updatedParams.theme;
        render(this, updatedParams);
        privateProps.innerParams.set(this, updatedParams);
        Object.defineProperties(this, {
          params: {
            value: Object.assign({}, this.params, params),
            writable: false,
            enumerable: true
          }
        });
      }
      const filterValidParams = (params) => {
        const validUpdatableParams = {};
        Object.keys(params).forEach((param) => {
          if (isUpdatableParameter(param)) {
            validUpdatableParams[param] = params[param];
          } else {
            warn(`Invalid parameter to update: ${param}`);
          }
        });
        return validUpdatableParams;
      };
      function _destroy() {
        const domCache = privateProps.domCache.get(this);
        const innerParams = privateProps.innerParams.get(this);
        if (!innerParams) {
          disposeWeakMaps(this);
          return;
        }
        if (domCache.popup && globalState.swalCloseEventFinishedCallback) {
          globalState.swalCloseEventFinishedCallback();
          delete globalState.swalCloseEventFinishedCallback;
        }
        if (typeof innerParams.didDestroy === "function") {
          innerParams.didDestroy();
        }
        globalState.eventEmitter.emit("didDestroy");
        disposeSwal(this);
      }
      const disposeSwal = (instance) => {
        disposeWeakMaps(instance);
        delete instance.params;
        delete globalState.keydownHandler;
        delete globalState.keydownTarget;
        delete globalState.currentInstance;
      };
      const disposeWeakMaps = (instance) => {
        if (instance.isAwaitingPromise) {
          unsetWeakMaps(privateProps, instance);
          instance.isAwaitingPromise = true;
        } else {
          unsetWeakMaps(privateMethods, instance);
          unsetWeakMaps(privateProps, instance);
          delete instance.isAwaitingPromise;
          delete instance.disableButtons;
          delete instance.enableButtons;
          delete instance.getInput;
          delete instance.disableInput;
          delete instance.enableInput;
          delete instance.hideLoading;
          delete instance.disableLoading;
          delete instance.showValidationMessage;
          delete instance.resetValidationMessage;
          delete instance.close;
          delete instance.closePopup;
          delete instance.closeModal;
          delete instance.closeToast;
          delete instance.rejectPromise;
          delete instance.update;
          delete instance._destroy;
        }
      };
      const unsetWeakMaps = (obj, instance) => {
        for (const i in obj) {
          obj[i].delete(instance);
        }
      };
      var instanceMethods = /* @__PURE__ */ Object.freeze({
        __proto__: null,
        _destroy,
        close,
        closeModal: close,
        closePopup: close,
        closeToast: close,
        disableButtons,
        disableInput,
        disableLoading: hideLoading,
        enableButtons,
        enableInput,
        getInput,
        handleAwaitingPromise,
        hideLoading,
        rejectPromise,
        resetValidationMessage,
        showValidationMessage,
        update
      });
      const handlePopupClick = (innerParams, domCache, dismissWith) => {
        if (innerParams.toast) {
          handleToastClick(innerParams, domCache, dismissWith);
        } else {
          handleModalMousedown(domCache);
          handleContainerMousedown(domCache);
          handleModalClick(innerParams, domCache, dismissWith);
        }
      };
      const handleToastClick = (innerParams, domCache, dismissWith) => {
        domCache.popup.onclick = () => {
          if (innerParams && (isAnyButtonShown(innerParams) || innerParams.timer || innerParams.input)) {
            return;
          }
          dismissWith(DismissReason.close);
        };
      };
      const isAnyButtonShown = (innerParams) => {
        return !!(innerParams.showConfirmButton || innerParams.showDenyButton || innerParams.showCancelButton || innerParams.showCloseButton);
      };
      let ignoreOutsideClick = false;
      const handleModalMousedown = (domCache) => {
        domCache.popup.onmousedown = () => {
          domCache.container.onmouseup = function(e) {
            domCache.container.onmouseup = () => {
            };
            if (e.target === domCache.container) {
              ignoreOutsideClick = true;
            }
          };
        };
      };
      const handleContainerMousedown = (domCache) => {
        domCache.container.onmousedown = (e) => {
          if (e.target === domCache.container) {
            e.preventDefault();
          }
          domCache.popup.onmouseup = function(e2) {
            domCache.popup.onmouseup = () => {
            };
            if (e2.target === domCache.popup || e2.target instanceof HTMLElement && domCache.popup.contains(e2.target)) {
              ignoreOutsideClick = true;
            }
          };
        };
      };
      const handleModalClick = (innerParams, domCache, dismissWith) => {
        domCache.container.onclick = (e) => {
          if (ignoreOutsideClick) {
            ignoreOutsideClick = false;
            return;
          }
          if (e.target === domCache.container && callIfFunction(innerParams.allowOutsideClick)) {
            dismissWith(DismissReason.backdrop);
          }
        };
      };
      const isJqueryElement = (elem) => typeof elem === "object" && elem.jquery;
      const isElement = (elem) => elem instanceof Element || isJqueryElement(elem);
      const argsToParams = (args) => {
        const params = {};
        if (typeof args[0] === "object" && !isElement(args[0])) {
          Object.assign(params, args[0]);
        } else {
          ["title", "html", "icon"].forEach((name, index) => {
            const arg = args[index];
            if (typeof arg === "string" || isElement(arg)) {
              params[name] = arg;
            } else if (arg !== void 0) {
              error(`Unexpected type of ${name}! Expected "string" or "Element", got ${typeof arg}`);
            }
          });
        }
        return params;
      };
      function fire(...args) {
        return new this(...args);
      }
      function mixin(mixinParams) {
        class MixinSwal extends this {
          _main(params, priorityMixinParams) {
            return super._main(params, Object.assign({}, mixinParams, priorityMixinParams));
          }
        }
        return MixinSwal;
      }
      const getTimerLeft = () => {
        return globalState.timeout && globalState.timeout.getTimerLeft();
      };
      const stopTimer = () => {
        if (globalState.timeout) {
          stopTimerProgressBar();
          return globalState.timeout.stop();
        }
      };
      const resumeTimer = () => {
        if (globalState.timeout) {
          const remaining = globalState.timeout.start();
          animateTimerProgressBar(remaining);
          return remaining;
        }
      };
      const toggleTimer = () => {
        const timer = globalState.timeout;
        return timer && (timer.running ? stopTimer() : resumeTimer());
      };
      const increaseTimer = (ms) => {
        if (globalState.timeout) {
          const remaining = globalState.timeout.increase(ms);
          animateTimerProgressBar(remaining, true);
          return remaining;
        }
      };
      const isTimerRunning = () => {
        return !!(globalState.timeout && globalState.timeout.isRunning());
      };
      let bodyClickListenerAdded = false;
      const clickHandlers = {};
      function bindClickHandler(attr = "data-swal-template") {
        clickHandlers[attr] = this;
        if (!bodyClickListenerAdded) {
          document.body.addEventListener("click", bodyClickListener);
          bodyClickListenerAdded = true;
        }
      }
      const bodyClickListener = (event) => {
        for (let el = event.target; el && el !== document; el = el.parentNode) {
          for (const attr in clickHandlers) {
            const template = el.getAttribute(attr);
            if (template) {
              clickHandlers[attr].fire({
                template
              });
              return;
            }
          }
        }
      };
      class EventEmitter2 {
        constructor() {
          this.events = {};
        }
        /**
         * @param {string} eventName
         * @returns {EventHandlers}
         */
        _getHandlersByEventName(eventName) {
          if (typeof this.events[eventName] === "undefined") {
            this.events[eventName] = [];
          }
          return this.events[eventName];
        }
        /**
         * @param {string} eventName
         * @param {EventHandler} eventHandler
         */
        on(eventName, eventHandler) {
          const currentHandlers = this._getHandlersByEventName(eventName);
          if (!currentHandlers.includes(eventHandler)) {
            currentHandlers.push(eventHandler);
          }
        }
        /**
         * @param {string} eventName
         * @param {EventHandler} eventHandler
         */
        once(eventName, eventHandler) {
          const onceFn = (...args) => {
            this.removeListener(eventName, onceFn);
            eventHandler.apply(this, args);
          };
          this.on(eventName, onceFn);
        }
        /**
         * @param {string} eventName
         * @param {Array} args
         */
        emit(eventName, ...args) {
          this._getHandlersByEventName(eventName).forEach(
            /**
             * @param {EventHandler} eventHandler
             */
            (eventHandler) => {
              try {
                eventHandler.apply(this, args);
              } catch (error2) {
                console.error(error2);
              }
            }
          );
        }
        /**
         * @param {string} eventName
         * @param {EventHandler} eventHandler
         */
        removeListener(eventName, eventHandler) {
          const currentHandlers = this._getHandlersByEventName(eventName);
          const index = currentHandlers.indexOf(eventHandler);
          if (index > -1) {
            currentHandlers.splice(index, 1);
          }
        }
        /**
         * @param {string} eventName
         */
        removeAllListeners(eventName) {
          if (this.events[eventName] !== void 0) {
            this.events[eventName].length = 0;
          }
        }
        reset() {
          this.events = {};
        }
      }
      globalState.eventEmitter = new EventEmitter2();
      const on = (eventName, eventHandler) => {
        globalState.eventEmitter.on(eventName, eventHandler);
      };
      const once = (eventName, eventHandler) => {
        globalState.eventEmitter.once(eventName, eventHandler);
      };
      const off = (eventName, eventHandler) => {
        if (!eventName) {
          globalState.eventEmitter.reset();
          return;
        }
        if (eventHandler) {
          globalState.eventEmitter.removeListener(eventName, eventHandler);
        } else {
          globalState.eventEmitter.removeAllListeners(eventName);
        }
      };
      var staticMethods = /* @__PURE__ */ Object.freeze({
        __proto__: null,
        argsToParams,
        bindClickHandler,
        clickCancel,
        clickConfirm,
        clickDeny,
        enableLoading: showLoading,
        fire,
        getActions,
        getCancelButton,
        getCloseButton,
        getConfirmButton,
        getContainer,
        getDenyButton,
        getFocusableElements,
        getFooter,
        getHtmlContainer,
        getIcon,
        getIconContent,
        getImage,
        getInputLabel,
        getLoader,
        getPopup,
        getProgressSteps,
        getTimerLeft,
        getTimerProgressBar,
        getTitle,
        getValidationMessage,
        increaseTimer,
        isDeprecatedParameter,
        isLoading,
        isTimerRunning,
        isUpdatableParameter,
        isValidParameter,
        isVisible,
        mixin,
        off,
        on,
        once,
        resumeTimer,
        showLoading,
        stopTimer,
        toggleTimer
      });
      class Timer {
        /**
         * @param {() => void} callback
         * @param {number} delay
         */
        constructor(callback, delay) {
          this.callback = callback;
          this.remaining = delay;
          this.running = false;
          this.start();
        }
        /**
         * @returns {number}
         */
        start() {
          if (!this.running) {
            this.running = true;
            this.started = /* @__PURE__ */ new Date();
            this.id = setTimeout(this.callback, this.remaining);
          }
          return this.remaining;
        }
        /**
         * @returns {number}
         */
        stop() {
          if (this.started && this.running) {
            this.running = false;
            clearTimeout(this.id);
            this.remaining -= (/* @__PURE__ */ new Date()).getTime() - this.started.getTime();
          }
          return this.remaining;
        }
        /**
         * @param {number} n
         * @returns {number}
         */
        increase(n) {
          const running = this.running;
          if (running) {
            this.stop();
          }
          this.remaining += n;
          if (running) {
            this.start();
          }
          return this.remaining;
        }
        /**
         * @returns {number}
         */
        getTimerLeft() {
          if (this.running) {
            this.stop();
            this.start();
          }
          return this.remaining;
        }
        /**
         * @returns {boolean}
         */
        isRunning() {
          return this.running;
        }
      }
      const swalStringParams = ["swal-title", "swal-html", "swal-footer"];
      const getTemplateParams = (params) => {
        const template = typeof params.template === "string" ? (
          /** @type {HTMLTemplateElement} */
          document.querySelector(params.template)
        ) : params.template;
        if (!template) {
          return {};
        }
        const templateContent = template.content;
        showWarningsForElements(templateContent);
        const result = Object.assign(getSwalParams(templateContent), getSwalFunctionParams(templateContent), getSwalButtons(templateContent), getSwalImage(templateContent), getSwalIcon(templateContent), getSwalInput(templateContent), getSwalStringParams(templateContent, swalStringParams));
        return result;
      };
      const getSwalParams = (templateContent) => {
        const result = {};
        const swalParams = Array.from(templateContent.querySelectorAll("swal-param"));
        swalParams.forEach((param) => {
          showWarningsForAttributes(param, ["name", "value"]);
          const paramName = (
            /** @type {keyof SweetAlertOptions} */
            param.getAttribute("name")
          );
          const value = param.getAttribute("value");
          if (!paramName || !value) {
            return;
          }
          if (typeof defaultParams[paramName] === "boolean") {
            result[paramName] = value !== "false";
          } else if (typeof defaultParams[paramName] === "object") {
            result[paramName] = JSON.parse(value);
          } else {
            result[paramName] = value;
          }
        });
        return result;
      };
      const getSwalFunctionParams = (templateContent) => {
        const result = {};
        const swalFunctions = Array.from(templateContent.querySelectorAll("swal-function-param"));
        swalFunctions.forEach((param) => {
          const paramName = (
            /** @type {keyof SweetAlertOptions} */
            param.getAttribute("name")
          );
          const value = param.getAttribute("value");
          if (!paramName || !value) {
            return;
          }
          result[paramName] = new Function(`return ${value}`)();
        });
        return result;
      };
      const getSwalButtons = (templateContent) => {
        const result = {};
        const swalButtons = Array.from(templateContent.querySelectorAll("swal-button"));
        swalButtons.forEach((button) => {
          showWarningsForAttributes(button, ["type", "color", "aria-label"]);
          const type = button.getAttribute("type");
          if (!type || !["confirm", "cancel", "deny"].includes(type)) {
            return;
          }
          result[`${type}ButtonText`] = button.innerHTML;
          result[`show${capitalizeFirstLetter(type)}Button`] = true;
          if (button.hasAttribute("color")) {
            result[`${type}ButtonColor`] = button.getAttribute("color");
          }
          if (button.hasAttribute("aria-label")) {
            result[`${type}ButtonAriaLabel`] = button.getAttribute("aria-label");
          }
        });
        return result;
      };
      const getSwalImage = (templateContent) => {
        const result = {};
        const image = templateContent.querySelector("swal-image");
        if (image) {
          showWarningsForAttributes(image, ["src", "width", "height", "alt"]);
          if (image.hasAttribute("src")) {
            result.imageUrl = image.getAttribute("src") || void 0;
          }
          if (image.hasAttribute("width")) {
            result.imageWidth = image.getAttribute("width") || void 0;
          }
          if (image.hasAttribute("height")) {
            result.imageHeight = image.getAttribute("height") || void 0;
          }
          if (image.hasAttribute("alt")) {
            result.imageAlt = image.getAttribute("alt") || void 0;
          }
        }
        return result;
      };
      const getSwalIcon = (templateContent) => {
        const result = {};
        const icon = templateContent.querySelector("swal-icon");
        if (icon) {
          showWarningsForAttributes(icon, ["type", "color"]);
          if (icon.hasAttribute("type")) {
            result.icon = icon.getAttribute("type");
          }
          if (icon.hasAttribute("color")) {
            result.iconColor = icon.getAttribute("color");
          }
          result.iconHtml = icon.innerHTML;
        }
        return result;
      };
      const getSwalInput = (templateContent) => {
        const result = {};
        const input = templateContent.querySelector("swal-input");
        if (input) {
          showWarningsForAttributes(input, ["type", "label", "placeholder", "value"]);
          result.input = input.getAttribute("type") || "text";
          if (input.hasAttribute("label")) {
            result.inputLabel = input.getAttribute("label");
          }
          if (input.hasAttribute("placeholder")) {
            result.inputPlaceholder = input.getAttribute("placeholder");
          }
          if (input.hasAttribute("value")) {
            result.inputValue = input.getAttribute("value");
          }
        }
        const inputOptions = Array.from(templateContent.querySelectorAll("swal-input-option"));
        if (inputOptions.length) {
          result.inputOptions = {};
          inputOptions.forEach((option) => {
            showWarningsForAttributes(option, ["value"]);
            const optionValue = option.getAttribute("value");
            if (!optionValue) {
              return;
            }
            const optionName = option.innerHTML;
            result.inputOptions[optionValue] = optionName;
          });
        }
        return result;
      };
      const getSwalStringParams = (templateContent, paramNames) => {
        const result = {};
        for (const i in paramNames) {
          const paramName = paramNames[i];
          const tag = templateContent.querySelector(paramName);
          if (tag) {
            showWarningsForAttributes(tag, []);
            result[paramName.replace(/^swal-/, "")] = tag.innerHTML.trim();
          }
        }
        return result;
      };
      const showWarningsForElements = (templateContent) => {
        const allowedElements = swalStringParams.concat(["swal-param", "swal-function-param", "swal-button", "swal-image", "swal-icon", "swal-input", "swal-input-option"]);
        Array.from(templateContent.children).forEach((el) => {
          const tagName = el.tagName.toLowerCase();
          if (!allowedElements.includes(tagName)) {
            warn(`Unrecognized element <${tagName}>`);
          }
        });
      };
      const showWarningsForAttributes = (el, allowedAttributes) => {
        Array.from(el.attributes).forEach((attribute) => {
          if (allowedAttributes.indexOf(attribute.name) === -1) {
            warn([`Unrecognized attribute "${attribute.name}" on <${el.tagName.toLowerCase()}>.`, `${allowedAttributes.length ? `Allowed attributes are: ${allowedAttributes.join(", ")}` : "To set the value, use HTML within the element."}`]);
          }
        });
      };
      const SHOW_CLASS_TIMEOUT = 10;
      const openPopup = (params) => {
        const container = getContainer();
        const popup = getPopup();
        if (typeof params.willOpen === "function") {
          params.willOpen(popup);
        }
        globalState.eventEmitter.emit("willOpen", popup);
        const bodyStyles = window.getComputedStyle(document.body);
        const initialBodyOverflow = bodyStyles.overflowY;
        addClasses(container, popup, params);
        setTimeout(() => {
          setScrollingVisibility(container, popup);
        }, SHOW_CLASS_TIMEOUT);
        if (isModal()) {
          fixScrollContainer(container, params.scrollbarPadding, initialBodyOverflow);
          setAriaHidden();
        }
        if (!isToast() && !globalState.previousActiveElement) {
          globalState.previousActiveElement = document.activeElement;
        }
        if (typeof params.didOpen === "function") {
          setTimeout(() => params.didOpen(popup));
        }
        globalState.eventEmitter.emit("didOpen", popup);
      };
      const swalOpenAnimationFinished = (event) => {
        const popup = getPopup();
        if (event.target !== popup) {
          return;
        }
        const container = getContainer();
        popup.removeEventListener("animationend", swalOpenAnimationFinished);
        popup.removeEventListener("transitionend", swalOpenAnimationFinished);
        container.style.overflowY = "auto";
        removeClass(container, swalClasses["no-transition"]);
      };
      const setScrollingVisibility = (container, popup) => {
        if (hasCssAnimation(popup)) {
          container.style.overflowY = "hidden";
          popup.addEventListener("animationend", swalOpenAnimationFinished);
          popup.addEventListener("transitionend", swalOpenAnimationFinished);
        } else {
          container.style.overflowY = "auto";
        }
      };
      const fixScrollContainer = (container, scrollbarPadding, initialBodyOverflow) => {
        iOSfix();
        if (scrollbarPadding && initialBodyOverflow !== "hidden") {
          replaceScrollbarWithPadding(initialBodyOverflow);
        }
        setTimeout(() => {
          container.scrollTop = 0;
        });
      };
      const addClasses = (container, popup, params) => {
        addClass(container, params.showClass.backdrop);
        if (params.animation) {
          popup.style.setProperty("opacity", "0", "important");
          show(popup, "grid");
          setTimeout(() => {
            addClass(popup, params.showClass.popup);
            popup.style.removeProperty("opacity");
          }, SHOW_CLASS_TIMEOUT);
        } else {
          show(popup, "grid");
        }
        addClass([document.documentElement, document.body], swalClasses.shown);
        if (params.heightAuto && params.backdrop && !params.toast) {
          addClass([document.documentElement, document.body], swalClasses["height-auto"]);
        }
      };
      var defaultInputValidators = {
        /**
         * @param {string} string
         * @param {string} [validationMessage]
         * @returns {Promise<string | void>}
         */
        email: (string, validationMessage) => {
          return /^[a-zA-Z0-9.+_'-]+@[a-zA-Z0-9.-]+\.[a-zA-Z0-9-]+$/.test(string) ? Promise.resolve() : Promise.resolve(validationMessage || "Invalid email address");
        },
        /**
         * @param {string} string
         * @param {string} [validationMessage]
         * @returns {Promise<string | void>}
         */
        url: (string, validationMessage) => {
          return /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-z]{2,63}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)$/.test(string) ? Promise.resolve() : Promise.resolve(validationMessage || "Invalid URL");
        }
      };
      function setDefaultInputValidators(params) {
        if (params.inputValidator) {
          return;
        }
        if (params.input === "email") {
          params.inputValidator = defaultInputValidators["email"];
        }
        if (params.input === "url") {
          params.inputValidator = defaultInputValidators["url"];
        }
      }
      function validateCustomTargetElement(params) {
        if (!params.target || typeof params.target === "string" && !document.querySelector(params.target) || typeof params.target !== "string" && !params.target.appendChild) {
          warn('Target parameter is not valid, defaulting to "body"');
          params.target = "body";
        }
      }
      function setParameters(params) {
        setDefaultInputValidators(params);
        if (params.showLoaderOnConfirm && !params.preConfirm) {
          warn("showLoaderOnConfirm is set to true, but preConfirm is not defined.\nshowLoaderOnConfirm should be used together with preConfirm, see usage example:\nhttps://sweetalert2.github.io/#ajax-request");
        }
        validateCustomTargetElement(params);
        if (typeof params.title === "string") {
          params.title = params.title.split("\n").join("<br />");
        }
        init(params);
      }
      let currentInstance;
      var _promise = /* @__PURE__ */ new WeakMap();
      class SweetAlert {
        /**
         * @param {...(SweetAlertOptions | string)} args
         * @this {SweetAlert}
         */
        constructor(...args) {
          _classPrivateFieldInitSpec(this, _promise, void 0);
          if (typeof window === "undefined") {
            return;
          }
          currentInstance = this;
          const outerParams = Object.freeze(this.constructor.argsToParams(args));
          this.params = outerParams;
          this.isAwaitingPromise = false;
          _classPrivateFieldSet2(_promise, this, this._main(currentInstance.params));
        }
        _main(userParams, mixinParams = {}) {
          showWarningsForParams(Object.assign({}, mixinParams, userParams));
          if (globalState.currentInstance) {
            const swalPromiseResolve = privateMethods.swalPromiseResolve.get(globalState.currentInstance);
            const {
              isAwaitingPromise
            } = globalState.currentInstance;
            globalState.currentInstance._destroy();
            if (!isAwaitingPromise) {
              swalPromiseResolve({
                isDismissed: true
              });
            }
            if (isModal()) {
              unsetAriaHidden();
            }
          }
          globalState.currentInstance = currentInstance;
          const innerParams = prepareParams(userParams, mixinParams);
          setParameters(innerParams);
          Object.freeze(innerParams);
          if (globalState.timeout) {
            globalState.timeout.stop();
            delete globalState.timeout;
          }
          clearTimeout(globalState.restoreFocusTimeout);
          const domCache = populateDomCache(currentInstance);
          render(currentInstance, innerParams);
          privateProps.innerParams.set(currentInstance, innerParams);
          return swalPromise(currentInstance, domCache, innerParams);
        }
        // `catch` cannot be the name of a module export, so we define our thenable methods here instead
        then(onFulfilled) {
          return _classPrivateFieldGet2(_promise, this).then(onFulfilled);
        }
        finally(onFinally) {
          return _classPrivateFieldGet2(_promise, this).finally(onFinally);
        }
      }
      const swalPromise = (instance, domCache, innerParams) => {
        return new Promise((resolve, reject) => {
          const dismissWith = (dismiss) => {
            instance.close({
              isDismissed: true,
              dismiss,
              isConfirmed: false,
              isDenied: false
            });
          };
          privateMethods.swalPromiseResolve.set(instance, resolve);
          privateMethods.swalPromiseReject.set(instance, reject);
          domCache.confirmButton.onclick = () => {
            handleConfirmButtonClick(instance);
          };
          domCache.denyButton.onclick = () => {
            handleDenyButtonClick(instance);
          };
          domCache.cancelButton.onclick = () => {
            handleCancelButtonClick(instance, dismissWith);
          };
          domCache.closeButton.onclick = () => {
            dismissWith(DismissReason.close);
          };
          handlePopupClick(innerParams, domCache, dismissWith);
          addKeydownHandler(globalState, innerParams, dismissWith);
          handleInputOptionsAndValue(instance, innerParams);
          openPopup(innerParams);
          setupTimer(globalState, innerParams, dismissWith);
          initFocus(domCache, innerParams);
          setTimeout(() => {
            domCache.container.scrollTop = 0;
          });
        });
      };
      const prepareParams = (userParams, mixinParams) => {
        const templateParams = getTemplateParams(userParams);
        const params = Object.assign({}, defaultParams, mixinParams, templateParams, userParams);
        params.showClass = Object.assign({}, defaultParams.showClass, params.showClass);
        params.hideClass = Object.assign({}, defaultParams.hideClass, params.hideClass);
        if (params.animation === false) {
          params.showClass = {
            backdrop: "swal2-noanimation"
          };
          params.hideClass = {};
        }
        return params;
      };
      const populateDomCache = (instance) => {
        const domCache = {
          popup: getPopup(),
          container: getContainer(),
          actions: getActions(),
          confirmButton: getConfirmButton(),
          denyButton: getDenyButton(),
          cancelButton: getCancelButton(),
          loader: getLoader(),
          closeButton: getCloseButton(),
          validationMessage: getValidationMessage(),
          progressSteps: getProgressSteps()
        };
        privateProps.domCache.set(instance, domCache);
        return domCache;
      };
      const setupTimer = (globalState2, innerParams, dismissWith) => {
        const timerProgressBar = getTimerProgressBar();
        hide(timerProgressBar);
        if (innerParams.timer) {
          globalState2.timeout = new Timer(() => {
            dismissWith("timer");
            delete globalState2.timeout;
          }, innerParams.timer);
          if (innerParams.timerProgressBar) {
            show(timerProgressBar);
            applyCustomClass(timerProgressBar, innerParams, "timerProgressBar");
            setTimeout(() => {
              if (globalState2.timeout && globalState2.timeout.running) {
                animateTimerProgressBar(innerParams.timer);
              }
            });
          }
        }
      };
      const initFocus = (domCache, innerParams) => {
        if (innerParams.toast) {
          return;
        }
        if (!callIfFunction(innerParams.allowEnterKey)) {
          warnAboutDeprecation("allowEnterKey");
          blurActiveElement();
          return;
        }
        if (focusAutofocus(domCache)) {
          return;
        }
        if (focusButton(domCache, innerParams)) {
          return;
        }
        setFocus(-1, 1);
      };
      const focusAutofocus = (domCache) => {
        const autofocusElements = Array.from(domCache.popup.querySelectorAll("[autofocus]"));
        for (const autofocusElement of autofocusElements) {
          if (autofocusElement instanceof HTMLElement && isVisible$1(autofocusElement)) {
            autofocusElement.focus();
            return true;
          }
        }
        return false;
      };
      const focusButton = (domCache, innerParams) => {
        if (innerParams.focusDeny && isVisible$1(domCache.denyButton)) {
          domCache.denyButton.focus();
          return true;
        }
        if (innerParams.focusCancel && isVisible$1(domCache.cancelButton)) {
          domCache.cancelButton.focus();
          return true;
        }
        if (innerParams.focusConfirm && isVisible$1(domCache.confirmButton)) {
          domCache.confirmButton.focus();
          return true;
        }
        return false;
      };
      const blurActiveElement = () => {
        if (document.activeElement instanceof HTMLElement && typeof document.activeElement.blur === "function") {
          document.activeElement.blur();
        }
      };
      SweetAlert.prototype.disableButtons = disableButtons;
      SweetAlert.prototype.enableButtons = enableButtons;
      SweetAlert.prototype.getInput = getInput;
      SweetAlert.prototype.disableInput = disableInput;
      SweetAlert.prototype.enableInput = enableInput;
      SweetAlert.prototype.hideLoading = hideLoading;
      SweetAlert.prototype.disableLoading = hideLoading;
      SweetAlert.prototype.showValidationMessage = showValidationMessage;
      SweetAlert.prototype.resetValidationMessage = resetValidationMessage;
      SweetAlert.prototype.close = close;
      SweetAlert.prototype.closePopup = close;
      SweetAlert.prototype.closeModal = close;
      SweetAlert.prototype.closeToast = close;
      SweetAlert.prototype.rejectPromise = rejectPromise;
      SweetAlert.prototype.update = update;
      SweetAlert.prototype._destroy = _destroy;
      Object.assign(SweetAlert, staticMethods);
      Object.keys(instanceMethods).forEach((key) => {
        SweetAlert[key] = function(...args) {
          if (currentInstance && currentInstance[key]) {
            return currentInstance[key](...args);
          }
          return null;
        };
      });
      SweetAlert.DismissReason = DismissReason;
      SweetAlert.version = "11.26.3";
      const Swal = SweetAlert;
      Swal.default = Swal;
      return Swal;
    }));
    if (typeof exports !== "undefined" && exports.Sweetalert2) {
      exports.swal = exports.sweetAlert = exports.Swal = exports.SweetAlert = exports.Sweetalert2;
    }
    "undefined" != typeof document && (function(e, t) {
      var n = e.createElement("style");
      if (e.getElementsByTagName("head")[0].appendChild(n), n.styleSheet) n.styleSheet.disabled || (n.styleSheet.cssText = t);
      else try {
        n.innerHTML = t;
      } catch (e2) {
        n.innerText = t;
      }
    })(document, ':root{--swal2-outline: 0 0 0 3px rgba(100, 150, 200, 0.5);--swal2-container-padding: 0.625em;--swal2-backdrop: rgba(0, 0, 0, 0.4);--swal2-backdrop-transition: background-color 0.15s;--swal2-width: 32em;--swal2-padding: 0 0 1.25em;--swal2-border: none;--swal2-border-radius: 0.3125rem;--swal2-background: white;--swal2-color: #545454;--swal2-show-animation: swal2-show 0.3s;--swal2-hide-animation: swal2-hide 0.15s forwards;--swal2-icon-zoom: 1;--swal2-icon-animations: true;--swal2-title-padding: 0.8em 1em 0;--swal2-html-container-padding: 1em 1.6em 0.3em;--swal2-input-border: 1px solid #d9d9d9;--swal2-input-border-radius: 0.1875em;--swal2-input-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.06), 0 0 0 3px transparent;--swal2-input-background: transparent;--swal2-input-transition: border-color 0.2s, box-shadow 0.2s;--swal2-input-hover-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.06), 0 0 0 3px transparent;--swal2-input-focus-border: 1px solid #b4dbed;--swal2-input-focus-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.06), 0 0 0 3px rgba(100, 150, 200, 0.5);--swal2-progress-step-background: #add8e6;--swal2-validation-message-background: #f0f0f0;--swal2-validation-message-color: #666;--swal2-footer-border-color: #eee;--swal2-footer-background: transparent;--swal2-footer-color: inherit;--swal2-timer-progress-bar-background: rgba(0, 0, 0, 0.3);--swal2-close-button-position: initial;--swal2-close-button-inset: auto;--swal2-close-button-font-size: 2.5em;--swal2-close-button-color: #ccc;--swal2-close-button-transition: color 0.2s, box-shadow 0.2s;--swal2-close-button-outline: initial;--swal2-close-button-box-shadow: inset 0 0 0 3px transparent;--swal2-close-button-focus-box-shadow: inset var(--swal2-outline);--swal2-close-button-hover-transform: none;--swal2-actions-justify-content: center;--swal2-actions-width: auto;--swal2-actions-margin: 1.25em auto 0;--swal2-actions-padding: 0;--swal2-actions-border-radius: 0;--swal2-actions-background: transparent;--swal2-action-button-transition: background-color 0.2s, box-shadow 0.2s;--swal2-action-button-hover: black 10%;--swal2-action-button-active: black 10%;--swal2-confirm-button-box-shadow: none;--swal2-confirm-button-border-radius: 0.25em;--swal2-confirm-button-background-color: #7066e0;--swal2-confirm-button-color: #fff;--swal2-deny-button-box-shadow: none;--swal2-deny-button-border-radius: 0.25em;--swal2-deny-button-background-color: #dc3741;--swal2-deny-button-color: #fff;--swal2-cancel-button-box-shadow: none;--swal2-cancel-button-border-radius: 0.25em;--swal2-cancel-button-background-color: #6e7881;--swal2-cancel-button-color: #fff;--swal2-toast-show-animation: swal2-toast-show 0.5s;--swal2-toast-hide-animation: swal2-toast-hide 0.1s forwards;--swal2-toast-border: none;--swal2-toast-box-shadow: 0 0 1px hsl(0deg 0% 0% / 0.075), 0 1px 2px hsl(0deg 0% 0% / 0.075), 1px 2px 4px hsl(0deg 0% 0% / 0.075), 1px 3px 8px hsl(0deg 0% 0% / 0.075), 2px 4px 16px hsl(0deg 0% 0% / 0.075)}[data-swal2-theme=dark]{--swal2-dark-theme-black: #19191a;--swal2-dark-theme-white: #e1e1e1;--swal2-background: var(--swal2-dark-theme-black);--swal2-color: var(--swal2-dark-theme-white);--swal2-footer-border-color: #555;--swal2-input-background: color-mix(in srgb, var(--swal2-dark-theme-black), var(--swal2-dark-theme-white) 10%);--swal2-validation-message-background: color-mix( in srgb, var(--swal2-dark-theme-black), var(--swal2-dark-theme-white) 10% );--swal2-validation-message-color: var(--swal2-dark-theme-white);--swal2-timer-progress-bar-background: rgba(255, 255, 255, 0.7)}@media(prefers-color-scheme: dark){[data-swal2-theme=auto]{--swal2-dark-theme-black: #19191a;--swal2-dark-theme-white: #e1e1e1;--swal2-background: var(--swal2-dark-theme-black);--swal2-color: var(--swal2-dark-theme-white);--swal2-footer-border-color: #555;--swal2-input-background: color-mix(in srgb, var(--swal2-dark-theme-black), var(--swal2-dark-theme-white) 10%);--swal2-validation-message-background: color-mix( in srgb, var(--swal2-dark-theme-black), var(--swal2-dark-theme-white) 10% );--swal2-validation-message-color: var(--swal2-dark-theme-white);--swal2-timer-progress-bar-background: rgba(255, 255, 255, 0.7)}}body.swal2-shown:not(.swal2-no-backdrop,.swal2-toast-shown){overflow:hidden}body.swal2-height-auto{height:auto !important}body.swal2-no-backdrop .swal2-container{background-color:rgba(0,0,0,0) !important;pointer-events:none}body.swal2-no-backdrop .swal2-container .swal2-popup{pointer-events:all}body.swal2-no-backdrop .swal2-container .swal2-modal{box-shadow:0 0 10px var(--swal2-backdrop)}body.swal2-toast-shown .swal2-container{box-sizing:border-box;width:360px;max-width:100%;background-color:rgba(0,0,0,0);pointer-events:none}body.swal2-toast-shown .swal2-container.swal2-top{inset:0 auto auto 50%;transform:translateX(-50%)}body.swal2-toast-shown .swal2-container.swal2-top-end,body.swal2-toast-shown .swal2-container.swal2-top-right{inset:0 0 auto auto}body.swal2-toast-shown .swal2-container.swal2-top-start,body.swal2-toast-shown .swal2-container.swal2-top-left{inset:0 auto auto 0}body.swal2-toast-shown .swal2-container.swal2-center-start,body.swal2-toast-shown .swal2-container.swal2-center-left{inset:50% auto auto 0;transform:translateY(-50%)}body.swal2-toast-shown .swal2-container.swal2-center{inset:50% auto auto 50%;transform:translate(-50%, -50%)}body.swal2-toast-shown .swal2-container.swal2-center-end,body.swal2-toast-shown .swal2-container.swal2-center-right{inset:50% 0 auto auto;transform:translateY(-50%)}body.swal2-toast-shown .swal2-container.swal2-bottom-start,body.swal2-toast-shown .swal2-container.swal2-bottom-left{inset:auto auto 0 0}body.swal2-toast-shown .swal2-container.swal2-bottom{inset:auto auto 0 50%;transform:translateX(-50%)}body.swal2-toast-shown .swal2-container.swal2-bottom-end,body.swal2-toast-shown .swal2-container.swal2-bottom-right{inset:auto 0 0 auto}@media print{body.swal2-shown:not(.swal2-no-backdrop,.swal2-toast-shown){overflow-y:scroll !important}body.swal2-shown:not(.swal2-no-backdrop,.swal2-toast-shown)>[aria-hidden=true]{display:none}body.swal2-shown:not(.swal2-no-backdrop,.swal2-toast-shown) .swal2-container{position:static !important}}div:where(.swal2-container){display:grid;position:fixed;z-index:1060;inset:0;box-sizing:border-box;grid-template-areas:"top-start     top            top-end" "center-start  center         center-end" "bottom-start  bottom-center  bottom-end";grid-template-rows:minmax(min-content, auto) minmax(min-content, auto) minmax(min-content, auto);height:100%;padding:var(--swal2-container-padding);overflow-x:hidden;transition:var(--swal2-backdrop-transition);-webkit-overflow-scrolling:touch}div:where(.swal2-container).swal2-backdrop-show,div:where(.swal2-container).swal2-noanimation{background:var(--swal2-backdrop)}div:where(.swal2-container).swal2-backdrop-hide{background:rgba(0,0,0,0) !important}div:where(.swal2-container).swal2-top-start,div:where(.swal2-container).swal2-center-start,div:where(.swal2-container).swal2-bottom-start{grid-template-columns:minmax(0, 1fr) auto auto}div:where(.swal2-container).swal2-top,div:where(.swal2-container).swal2-center,div:where(.swal2-container).swal2-bottom{grid-template-columns:auto minmax(0, 1fr) auto}div:where(.swal2-container).swal2-top-end,div:where(.swal2-container).swal2-center-end,div:where(.swal2-container).swal2-bottom-end{grid-template-columns:auto auto minmax(0, 1fr)}div:where(.swal2-container).swal2-top-start>.swal2-popup{align-self:start}div:where(.swal2-container).swal2-top>.swal2-popup{grid-column:2;place-self:start center}div:where(.swal2-container).swal2-top-end>.swal2-popup,div:where(.swal2-container).swal2-top-right>.swal2-popup{grid-column:3;place-self:start end}div:where(.swal2-container).swal2-center-start>.swal2-popup,div:where(.swal2-container).swal2-center-left>.swal2-popup{grid-row:2;align-self:center}div:where(.swal2-container).swal2-center>.swal2-popup{grid-column:2;grid-row:2;place-self:center center}div:where(.swal2-container).swal2-center-end>.swal2-popup,div:where(.swal2-container).swal2-center-right>.swal2-popup{grid-column:3;grid-row:2;place-self:center end}div:where(.swal2-container).swal2-bottom-start>.swal2-popup,div:where(.swal2-container).swal2-bottom-left>.swal2-popup{grid-column:1;grid-row:3;align-self:end}div:where(.swal2-container).swal2-bottom>.swal2-popup{grid-column:2;grid-row:3;place-self:end center}div:where(.swal2-container).swal2-bottom-end>.swal2-popup,div:where(.swal2-container).swal2-bottom-right>.swal2-popup{grid-column:3;grid-row:3;place-self:end end}div:where(.swal2-container).swal2-grow-row>.swal2-popup,div:where(.swal2-container).swal2-grow-fullscreen>.swal2-popup{grid-column:1/4;width:100%}div:where(.swal2-container).swal2-grow-column>.swal2-popup,div:where(.swal2-container).swal2-grow-fullscreen>.swal2-popup{grid-row:1/4;align-self:stretch}div:where(.swal2-container).swal2-no-transition{transition:none !important}div:where(.swal2-container)[popover]{width:auto;border:0}div:where(.swal2-container) div:where(.swal2-popup){display:none;position:relative;box-sizing:border-box;grid-template-columns:minmax(0, 100%);width:var(--swal2-width);max-width:100%;padding:var(--swal2-padding);border:var(--swal2-border);border-radius:var(--swal2-border-radius);background:var(--swal2-background);color:var(--swal2-color);font-family:inherit;font-size:1rem;container-name:swal2-popup}div:where(.swal2-container) div:where(.swal2-popup):focus{outline:none}div:where(.swal2-container) div:where(.swal2-popup).swal2-loading{overflow-y:hidden}div:where(.swal2-container) div:where(.swal2-popup).swal2-draggable{cursor:grab}div:where(.swal2-container) div:where(.swal2-popup).swal2-draggable div:where(.swal2-icon){cursor:grab}div:where(.swal2-container) div:where(.swal2-popup).swal2-dragging{cursor:grabbing}div:where(.swal2-container) div:where(.swal2-popup).swal2-dragging div:where(.swal2-icon){cursor:grabbing}div:where(.swal2-container) h2:where(.swal2-title){position:relative;max-width:100%;margin:0;padding:var(--swal2-title-padding);color:inherit;font-size:1.875em;font-weight:600;text-align:center;text-transform:none;overflow-wrap:break-word;cursor:initial}div:where(.swal2-container) div:where(.swal2-actions){display:flex;z-index:1;box-sizing:border-box;flex-wrap:wrap;align-items:center;justify-content:var(--swal2-actions-justify-content);width:var(--swal2-actions-width);margin:var(--swal2-actions-margin);padding:var(--swal2-actions-padding);border-radius:var(--swal2-actions-border-radius);background:var(--swal2-actions-background)}div:where(.swal2-container) div:where(.swal2-loader){display:none;align-items:center;justify-content:center;width:2.2em;height:2.2em;margin:0 1.875em;animation:swal2-rotate-loading 1.5s linear 0s infinite normal;border-width:.25em;border-style:solid;border-radius:100%;border-color:#2778c4 rgba(0,0,0,0) #2778c4 rgba(0,0,0,0)}div:where(.swal2-container) button:where(.swal2-styled){margin:.3125em;padding:.625em 1.1em;transition:var(--swal2-action-button-transition);border:none;box-shadow:0 0 0 3px rgba(0,0,0,0);font-weight:500}div:where(.swal2-container) button:where(.swal2-styled):not([disabled]){cursor:pointer}div:where(.swal2-container) button:where(.swal2-styled):where(.swal2-confirm){border-radius:var(--swal2-confirm-button-border-radius);background:initial;background-color:var(--swal2-confirm-button-background-color);box-shadow:var(--swal2-confirm-button-box-shadow);color:var(--swal2-confirm-button-color);font-size:1em}div:where(.swal2-container) button:where(.swal2-styled):where(.swal2-confirm):hover{background-color:color-mix(in srgb, var(--swal2-confirm-button-background-color), var(--swal2-action-button-hover))}div:where(.swal2-container) button:where(.swal2-styled):where(.swal2-confirm):active{background-color:color-mix(in srgb, var(--swal2-confirm-button-background-color), var(--swal2-action-button-active))}div:where(.swal2-container) button:where(.swal2-styled):where(.swal2-deny){border-radius:var(--swal2-deny-button-border-radius);background:initial;background-color:var(--swal2-deny-button-background-color);box-shadow:var(--swal2-deny-button-box-shadow);color:var(--swal2-deny-button-color);font-size:1em}div:where(.swal2-container) button:where(.swal2-styled):where(.swal2-deny):hover{background-color:color-mix(in srgb, var(--swal2-deny-button-background-color), var(--swal2-action-button-hover))}div:where(.swal2-container) button:where(.swal2-styled):where(.swal2-deny):active{background-color:color-mix(in srgb, var(--swal2-deny-button-background-color), var(--swal2-action-button-active))}div:where(.swal2-container) button:where(.swal2-styled):where(.swal2-cancel){border-radius:var(--swal2-cancel-button-border-radius);background:initial;background-color:var(--swal2-cancel-button-background-color);box-shadow:var(--swal2-cancel-button-box-shadow);color:var(--swal2-cancel-button-color);font-size:1em}div:where(.swal2-container) button:where(.swal2-styled):where(.swal2-cancel):hover{background-color:color-mix(in srgb, var(--swal2-cancel-button-background-color), var(--swal2-action-button-hover))}div:where(.swal2-container) button:where(.swal2-styled):where(.swal2-cancel):active{background-color:color-mix(in srgb, var(--swal2-cancel-button-background-color), var(--swal2-action-button-active))}div:where(.swal2-container) button:where(.swal2-styled):focus-visible{outline:none;box-shadow:var(--swal2-action-button-focus-box-shadow)}div:where(.swal2-container) button:where(.swal2-styled)[disabled]:not(.swal2-loading){opacity:.4}div:where(.swal2-container) button:where(.swal2-styled)::-moz-focus-inner{border:0}div:where(.swal2-container) div:where(.swal2-footer){margin:1em 0 0;padding:1em 1em 0;border-top:1px solid var(--swal2-footer-border-color);background:var(--swal2-footer-background);color:var(--swal2-footer-color);font-size:1em;text-align:center;cursor:initial}div:where(.swal2-container) .swal2-timer-progress-bar-container{position:absolute;right:0;bottom:0;left:0;grid-column:auto !important;overflow:hidden;border-bottom-right-radius:var(--swal2-border-radius);border-bottom-left-radius:var(--swal2-border-radius)}div:where(.swal2-container) div:where(.swal2-timer-progress-bar){width:100%;height:.25em;background:var(--swal2-timer-progress-bar-background)}div:where(.swal2-container) img:where(.swal2-image){max-width:100%;margin:2em auto 1em;cursor:initial}div:where(.swal2-container) button:where(.swal2-close){position:var(--swal2-close-button-position);inset:var(--swal2-close-button-inset);z-index:2;align-items:center;justify-content:center;width:1.2em;height:1.2em;margin-top:0;margin-right:0;margin-bottom:-1.2em;padding:0;overflow:hidden;transition:var(--swal2-close-button-transition);border:none;border-radius:var(--swal2-border-radius);outline:var(--swal2-close-button-outline);background:rgba(0,0,0,0);color:var(--swal2-close-button-color);font-family:monospace;font-size:var(--swal2-close-button-font-size);cursor:pointer;justify-self:end}div:where(.swal2-container) button:where(.swal2-close):hover{transform:var(--swal2-close-button-hover-transform);background:rgba(0,0,0,0);color:#f27474}div:where(.swal2-container) button:where(.swal2-close):focus-visible{outline:none;box-shadow:var(--swal2-close-button-focus-box-shadow)}div:where(.swal2-container) button:where(.swal2-close)::-moz-focus-inner{border:0}div:where(.swal2-container) div:where(.swal2-html-container){z-index:1;justify-content:center;margin:0;padding:var(--swal2-html-container-padding);overflow:auto;color:inherit;font-size:1.125em;font-weight:normal;line-height:normal;text-align:center;overflow-wrap:break-word;word-break:break-word;cursor:initial}div:where(.swal2-container) input:where(.swal2-input),div:where(.swal2-container) input:where(.swal2-file),div:where(.swal2-container) textarea:where(.swal2-textarea),div:where(.swal2-container) select:where(.swal2-select),div:where(.swal2-container) div:where(.swal2-radio),div:where(.swal2-container) label:where(.swal2-checkbox){margin:1em 2em 3px}div:where(.swal2-container) input:where(.swal2-input),div:where(.swal2-container) input:where(.swal2-file),div:where(.swal2-container) textarea:where(.swal2-textarea){box-sizing:border-box;width:auto;transition:var(--swal2-input-transition);border:var(--swal2-input-border);border-radius:var(--swal2-input-border-radius);background:var(--swal2-input-background);box-shadow:var(--swal2-input-box-shadow);color:inherit;font-size:1.125em}div:where(.swal2-container) input:where(.swal2-input).swal2-inputerror,div:where(.swal2-container) input:where(.swal2-file).swal2-inputerror,div:where(.swal2-container) textarea:where(.swal2-textarea).swal2-inputerror{border-color:#f27474 !important;box-shadow:0 0 2px #f27474 !important}div:where(.swal2-container) input:where(.swal2-input):hover,div:where(.swal2-container) input:where(.swal2-file):hover,div:where(.swal2-container) textarea:where(.swal2-textarea):hover{box-shadow:var(--swal2-input-hover-box-shadow)}div:where(.swal2-container) input:where(.swal2-input):focus,div:where(.swal2-container) input:where(.swal2-file):focus,div:where(.swal2-container) textarea:where(.swal2-textarea):focus{border:var(--swal2-input-focus-border);outline:none;box-shadow:var(--swal2-input-focus-box-shadow)}div:where(.swal2-container) input:where(.swal2-input)::placeholder,div:where(.swal2-container) input:where(.swal2-file)::placeholder,div:where(.swal2-container) textarea:where(.swal2-textarea)::placeholder{color:#ccc}div:where(.swal2-container) .swal2-range{margin:1em 2em 3px;background:var(--swal2-background)}div:where(.swal2-container) .swal2-range input{width:80%}div:where(.swal2-container) .swal2-range output{width:20%;color:inherit;font-weight:600;text-align:center}div:where(.swal2-container) .swal2-range input,div:where(.swal2-container) .swal2-range output{height:2.625em;padding:0;font-size:1.125em;line-height:2.625em}div:where(.swal2-container) .swal2-input{height:2.625em;padding:0 .75em}div:where(.swal2-container) .swal2-file{width:75%;margin-right:auto;margin-left:auto;background:var(--swal2-input-background);font-size:1.125em}div:where(.swal2-container) .swal2-textarea{height:6.75em;padding:.75em}div:where(.swal2-container) .swal2-select{min-width:50%;max-width:100%;padding:.375em .625em;background:var(--swal2-input-background);color:inherit;font-size:1.125em}div:where(.swal2-container) .swal2-radio,div:where(.swal2-container) .swal2-checkbox{align-items:center;justify-content:center;background:var(--swal2-background);color:inherit}div:where(.swal2-container) .swal2-radio label,div:where(.swal2-container) .swal2-checkbox label{margin:0 .6em;font-size:1.125em}div:where(.swal2-container) .swal2-radio input,div:where(.swal2-container) .swal2-checkbox input{flex-shrink:0;margin:0 .4em}div:where(.swal2-container) label:where(.swal2-input-label){display:flex;justify-content:center;margin:1em auto 0}div:where(.swal2-container) div:where(.swal2-validation-message){align-items:center;justify-content:center;margin:1em 0 0;padding:.625em;overflow:hidden;background:var(--swal2-validation-message-background);color:var(--swal2-validation-message-color);font-size:1em;font-weight:300}div:where(.swal2-container) div:where(.swal2-validation-message)::before{content:"!";display:inline-block;width:1.5em;min-width:1.5em;height:1.5em;margin:0 .625em;border-radius:50%;background-color:#f27474;color:#fff;font-weight:600;line-height:1.5em;text-align:center}div:where(.swal2-container) .swal2-progress-steps{flex-wrap:wrap;align-items:center;max-width:100%;margin:1.25em auto;padding:0;background:rgba(0,0,0,0);font-weight:600}div:where(.swal2-container) .swal2-progress-steps li{display:inline-block;position:relative}div:where(.swal2-container) .swal2-progress-steps .swal2-progress-step{z-index:20;flex-shrink:0;width:2em;height:2em;border-radius:2em;background:#2778c4;color:#fff;line-height:2em;text-align:center}div:where(.swal2-container) .swal2-progress-steps .swal2-progress-step.swal2-active-progress-step{background:#2778c4}div:where(.swal2-container) .swal2-progress-steps .swal2-progress-step.swal2-active-progress-step~.swal2-progress-step{background:var(--swal2-progress-step-background);color:#fff}div:where(.swal2-container) .swal2-progress-steps .swal2-progress-step.swal2-active-progress-step~.swal2-progress-step-line{background:var(--swal2-progress-step-background)}div:where(.swal2-container) .swal2-progress-steps .swal2-progress-step-line{z-index:10;flex-shrink:0;width:2.5em;height:.4em;margin:0 -1px;background:#2778c4}div:where(.swal2-icon){position:relative;box-sizing:content-box;justify-content:center;width:5em;height:5em;margin:2.5em auto .6em;zoom:var(--swal2-icon-zoom);border:.25em solid rgba(0,0,0,0);border-radius:50%;border-color:#000;font-family:inherit;line-height:5em;cursor:default;user-select:none}div:where(.swal2-icon) .swal2-icon-content{display:flex;align-items:center;font-size:3.75em}div:where(.swal2-icon).swal2-error{border-color:#f27474;color:#f27474}div:where(.swal2-icon).swal2-error .swal2-x-mark{position:relative;flex-grow:1}div:where(.swal2-icon).swal2-error [class^=swal2-x-mark-line]{display:block;position:absolute;top:2.3125em;width:2.9375em;height:.3125em;border-radius:.125em;background-color:#f27474}div:where(.swal2-icon).swal2-error [class^=swal2-x-mark-line][class$=left]{left:1.0625em;transform:rotate(45deg)}div:where(.swal2-icon).swal2-error [class^=swal2-x-mark-line][class$=right]{right:1em;transform:rotate(-45deg)}@container swal2-popup style(--swal2-icon-animations:true){div:where(.swal2-icon).swal2-error.swal2-icon-show{animation:swal2-animate-error-icon .5s}div:where(.swal2-icon).swal2-error.swal2-icon-show .swal2-x-mark{animation:swal2-animate-error-x-mark .5s}}div:where(.swal2-icon).swal2-warning{border-color:#f8bb86;color:#f8bb86}@container swal2-popup style(--swal2-icon-animations:true){div:where(.swal2-icon).swal2-warning.swal2-icon-show{animation:swal2-animate-error-icon .5s}div:where(.swal2-icon).swal2-warning.swal2-icon-show .swal2-icon-content{animation:swal2-animate-i-mark .5s}}div:where(.swal2-icon).swal2-info{border-color:#3fc3ee;color:#3fc3ee}@container swal2-popup style(--swal2-icon-animations:true){div:where(.swal2-icon).swal2-info.swal2-icon-show{animation:swal2-animate-error-icon .5s}div:where(.swal2-icon).swal2-info.swal2-icon-show .swal2-icon-content{animation:swal2-animate-i-mark .8s}}div:where(.swal2-icon).swal2-question{border-color:#87adbd;color:#87adbd}@container swal2-popup style(--swal2-icon-animations:true){div:where(.swal2-icon).swal2-question.swal2-icon-show{animation:swal2-animate-error-icon .5s}div:where(.swal2-icon).swal2-question.swal2-icon-show .swal2-icon-content{animation:swal2-animate-question-mark .8s}}div:where(.swal2-icon).swal2-success{border-color:#a5dc86;color:#a5dc86}div:where(.swal2-icon).swal2-success [class^=swal2-success-circular-line]{position:absolute;width:3.75em;height:7.5em;border-radius:50%}div:where(.swal2-icon).swal2-success [class^=swal2-success-circular-line][class$=left]{top:-0.4375em;left:-2.0635em;transform:rotate(-45deg);transform-origin:3.75em 3.75em;border-radius:7.5em 0 0 7.5em}div:where(.swal2-icon).swal2-success [class^=swal2-success-circular-line][class$=right]{top:-0.6875em;left:1.875em;transform:rotate(-45deg);transform-origin:0 3.75em;border-radius:0 7.5em 7.5em 0}div:where(.swal2-icon).swal2-success .swal2-success-ring{position:absolute;z-index:2;top:-0.25em;left:-0.25em;box-sizing:content-box;width:100%;height:100%;border:.25em solid rgba(165,220,134,.3);border-radius:50%}div:where(.swal2-icon).swal2-success .swal2-success-fix{position:absolute;z-index:1;top:.5em;left:1.625em;width:.4375em;height:5.625em;transform:rotate(-45deg)}div:where(.swal2-icon).swal2-success [class^=swal2-success-line]{display:block;position:absolute;z-index:2;height:.3125em;border-radius:.125em;background-color:#a5dc86}div:where(.swal2-icon).swal2-success [class^=swal2-success-line][class$=tip]{top:2.875em;left:.8125em;width:1.5625em;transform:rotate(45deg)}div:where(.swal2-icon).swal2-success [class^=swal2-success-line][class$=long]{top:2.375em;right:.5em;width:2.9375em;transform:rotate(-45deg)}@container swal2-popup style(--swal2-icon-animations:true){div:where(.swal2-icon).swal2-success.swal2-icon-show .swal2-success-line-tip{animation:swal2-animate-success-line-tip .75s}div:where(.swal2-icon).swal2-success.swal2-icon-show .swal2-success-line-long{animation:swal2-animate-success-line-long .75s}div:where(.swal2-icon).swal2-success.swal2-icon-show .swal2-success-circular-line-right{animation:swal2-rotate-success-circular-line 4.25s ease-in}}[class^=swal2]{-webkit-tap-highlight-color:rgba(0,0,0,0)}.swal2-show{animation:var(--swal2-show-animation)}.swal2-hide{animation:var(--swal2-hide-animation)}.swal2-noanimation{transition:none}.swal2-scrollbar-measure{position:absolute;top:-9999px;width:50px;height:50px;overflow:scroll}.swal2-rtl .swal2-close{margin-right:initial;margin-left:0}.swal2-rtl .swal2-timer-progress-bar{right:0;left:auto}.swal2-toast{box-sizing:border-box;grid-column:1/4 !important;grid-row:1/4 !important;grid-template-columns:min-content auto min-content;padding:1em;overflow-y:hidden;border:var(--swal2-toast-border);background:var(--swal2-background);box-shadow:var(--swal2-toast-box-shadow);pointer-events:all}.swal2-toast>*{grid-column:2}.swal2-toast h2:where(.swal2-title){margin:.5em 1em;padding:0;font-size:1em;text-align:initial}.swal2-toast .swal2-loading{justify-content:center}.swal2-toast input:where(.swal2-input){height:2em;margin:.5em;font-size:1em}.swal2-toast .swal2-validation-message{font-size:1em}.swal2-toast div:where(.swal2-footer){margin:.5em 0 0;padding:.5em 0 0;font-size:.8em}.swal2-toast button:where(.swal2-close){grid-column:3/3;grid-row:1/99;align-self:center;width:.8em;height:.8em;margin:0;font-size:2em}.swal2-toast div:where(.swal2-html-container){margin:.5em 1em;padding:0;overflow:initial;font-size:1em;text-align:initial}.swal2-toast div:where(.swal2-html-container):empty{padding:0}.swal2-toast .swal2-loader{grid-column:1;grid-row:1/99;align-self:center;width:2em;height:2em;margin:.25em}.swal2-toast .swal2-icon{grid-column:1;grid-row:1/99;align-self:center;width:2em;min-width:2em;height:2em;margin:0 .5em 0 0}.swal2-toast .swal2-icon .swal2-icon-content{display:flex;align-items:center;font-size:1.8em;font-weight:bold}.swal2-toast .swal2-icon.swal2-success .swal2-success-ring{width:2em;height:2em}.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line]{top:.875em;width:1.375em}.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=left]{left:.3125em}.swal2-toast .swal2-icon.swal2-error [class^=swal2-x-mark-line][class$=right]{right:.3125em}.swal2-toast div:where(.swal2-actions){justify-content:flex-start;height:auto;margin:0;margin-top:.5em;padding:0 .5em}.swal2-toast button:where(.swal2-styled){margin:.25em .5em;padding:.4em .6em;font-size:1em}.swal2-toast .swal2-success{border-color:#a5dc86}.swal2-toast .swal2-success [class^=swal2-success-circular-line]{position:absolute;width:1.6em;height:3em;border-radius:50%}.swal2-toast .swal2-success [class^=swal2-success-circular-line][class$=left]{top:-0.8em;left:-0.5em;transform:rotate(-45deg);transform-origin:2em 2em;border-radius:4em 0 0 4em}.swal2-toast .swal2-success [class^=swal2-success-circular-line][class$=right]{top:-0.25em;left:.9375em;transform-origin:0 1.5em;border-radius:0 4em 4em 0}.swal2-toast .swal2-success .swal2-success-ring{width:2em;height:2em}.swal2-toast .swal2-success .swal2-success-fix{top:0;left:.4375em;width:.4375em;height:2.6875em}.swal2-toast .swal2-success [class^=swal2-success-line]{height:.3125em}.swal2-toast .swal2-success [class^=swal2-success-line][class$=tip]{top:1.125em;left:.1875em;width:.75em}.swal2-toast .swal2-success [class^=swal2-success-line][class$=long]{top:.9375em;right:.1875em;width:1.375em}@container swal2-popup style(--swal2-icon-animations:true){.swal2-toast .swal2-success.swal2-icon-show .swal2-success-line-tip{animation:swal2-toast-animate-success-line-tip .75s}.swal2-toast .swal2-success.swal2-icon-show .swal2-success-line-long{animation:swal2-toast-animate-success-line-long .75s}}.swal2-toast.swal2-show{animation:var(--swal2-toast-show-animation)}.swal2-toast.swal2-hide{animation:var(--swal2-toast-hide-animation)}@keyframes swal2-show{0%{transform:translate3d(0, -50px, 0) scale(0.9);opacity:0}100%{transform:translate3d(0, 0, 0) scale(1);opacity:1}}@keyframes swal2-hide{0%{transform:translate3d(0, 0, 0) scale(1);opacity:1}100%{transform:translate3d(0, -50px, 0) scale(0.9);opacity:0}}@keyframes swal2-animate-success-line-tip{0%{top:1.1875em;left:.0625em;width:0}54%{top:1.0625em;left:.125em;width:0}70%{top:2.1875em;left:-0.375em;width:3.125em}84%{top:3em;left:1.3125em;width:1.0625em}100%{top:2.8125em;left:.8125em;width:1.5625em}}@keyframes swal2-animate-success-line-long{0%{top:3.375em;right:2.875em;width:0}65%{top:3.375em;right:2.875em;width:0}84%{top:2.1875em;right:0;width:3.4375em}100%{top:2.375em;right:.5em;width:2.9375em}}@keyframes swal2-rotate-success-circular-line{0%{transform:rotate(-45deg)}5%{transform:rotate(-45deg)}12%{transform:rotate(-405deg)}100%{transform:rotate(-405deg)}}@keyframes swal2-animate-error-x-mark{0%{margin-top:1.625em;transform:scale(0.4);opacity:0}50%{margin-top:1.625em;transform:scale(0.4);opacity:0}80%{margin-top:-0.375em;transform:scale(1.15)}100%{margin-top:0;transform:scale(1);opacity:1}}@keyframes swal2-animate-error-icon{0%{transform:rotateX(100deg);opacity:0}100%{transform:rotateX(0deg);opacity:1}}@keyframes swal2-rotate-loading{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}@keyframes swal2-animate-question-mark{0%{transform:rotateY(-360deg)}100%{transform:rotateY(0)}}@keyframes swal2-animate-i-mark{0%{transform:rotateZ(45deg);opacity:0}25%{transform:rotateZ(-25deg);opacity:.4}50%{transform:rotateZ(15deg);opacity:.8}75%{transform:rotateZ(-5deg);opacity:1}100%{transform:rotateX(0);opacity:1}}@keyframes swal2-toast-show{0%{transform:translateY(-0.625em) rotateZ(2deg)}33%{transform:translateY(0) rotateZ(-2deg)}66%{transform:translateY(0.3125em) rotateZ(2deg)}100%{transform:translateY(0) rotateZ(0deg)}}@keyframes swal2-toast-hide{100%{transform:rotateZ(1deg);opacity:0}}@keyframes swal2-toast-animate-success-line-tip{0%{top:.5625em;left:.0625em;width:0}54%{top:.125em;left:.125em;width:0}70%{top:.625em;left:-0.25em;width:1.625em}84%{top:1.0625em;left:.75em;width:.5em}100%{top:1.125em;left:.1875em;width:.75em}}@keyframes swal2-toast-animate-success-line-long{0%{top:1.625em;right:1.375em;width:0}65%{top:1.25em;right:.9375em;width:0}84%{top:.9375em;right:0;width:1.125em}100%{top:.9375em;right:.1875em;width:1.375em}}');
  }
});

export {
  Validators,
  FormBuilder,
  ReactiveFormsModule,
  init_forms,
  AuthService,
  init_auth_service,
  require_sweetalert2_all
};
/*! Bundled license information:

@angular/forms/fesm2022/forms.mjs:
  (**
   * @license Angular v20.3.11
   * (c) 2010-2025 Google LLC. https://angular.dev/
   * License: MIT
   *)

sweetalert2/dist/sweetalert2.all.js:
  (*!
  * sweetalert2 v11.26.3
  * Released under the MIT License.
  *)
*/
//# sourceMappingURL=chunk-7VMJBVAZ.js.map
