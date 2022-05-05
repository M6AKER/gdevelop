/*
 * GDevelop Core
 * Copyright 2008-present Florian Rival (Florian.Rival@gmail.com). All rights
 * reserved. This project is released under the MIT License.
 */
#include "GDCore/IDE/Events/ExpressionValidator.h"

#include <algorithm>
#include <memory>
#include <vector>

#include "GDCore/CommonTools.h"
#include "GDCore/Events/Expression.h"
#include "GDCore/Extensions/Metadata/ExpressionMetadata.h"
#include "GDCore/Extensions/Metadata/InstructionMetadata.h"
#include "GDCore/Extensions/Metadata/MetadataProvider.h"
#include "GDCore/Extensions/Platform.h"
#include "GDCore/Project/Layout.h"
#include "GDCore/Project/Project.h"
#include "GDCore/Tools/Localization.h"
#include "GDCore/Tools/MakeUnique.h"
#include "GDCore/Events/Parsers/ExpressionParser2.h"

using namespace std;

namespace gd {

namespace {
/**
 * Return the minimum number of parameters, starting from a given parameter
 * (by convention, 1 for object functions and 2 for behavior functions).
 */
size_t GetMinimumParametersNumber(
    const std::vector<gd::ParameterMetadata>& parameters,
    size_t initialParameterIndex) {
  size_t nb = 0;
  for (std::size_t i = initialParameterIndex; i < parameters.size(); ++i) {
    if (!parameters[i].optional && !parameters[i].codeOnly) nb++;
  }

  return nb;
}

/**
 * Return the maximum number of parameters, starting from a given parameter
 * (by convention, 1 for object functions and 2 for behavior functions).
 */
size_t GetMaximumParametersNumber(
    const std::vector<gd::ParameterMetadata>& parameters,
    size_t initialParameterIndex) {
  size_t nb = 0;
  for (std::size_t i = initialParameterIndex; i < parameters.size(); ++i) {
    if (!parameters[i].codeOnly) nb++;
  }

  return nb;
}

}  // namespace

ExpressionValidator::Type ExpressionValidator::ValidateFunction(const gd::FunctionCallNode& function) {

  ReportAnyError(function);
  
  gd::String objectType = function.objectName.empty() ? gd::String() :
      GetTypeOfObject(globalObjectsContainer, objectsContainer, function.objectName);
      
  gd::String behaviorType = function.behaviorName.empty() ? gd::String() :
      GetTypeOfBehavior(globalObjectsContainer, objectsContainer, function.behaviorName);

  const gd::ExpressionMetadata &metadata = function.behaviorName.empty() ?
      function.objectName.empty() ?
          MetadataProvider::GetAnyExpressionMetadata(platform, function.functionName) :
          MetadataProvider::GetObjectAnyExpressionMetadata(
              platform, objectType, function.functionName) : 
      MetadataProvider::GetBehaviorAnyExpressionMetadata(
            platform, behaviorType, function.functionName);

  if (!function.objectName.empty()) {
    // If the function needs a capability on the object that may not be covered
    // by all objects, check it now.
    if (!metadata.GetRequiredBaseObjectCapability().empty()) {
      const gd::ObjectMetadata &objectMetadata =
          MetadataProvider::GetObjectMetadata(platform, objectType);

      if (objectMetadata.IsUnsupportedBaseObjectCapability(
              metadata.GetRequiredBaseObjectCapability())) {
        RaiseTypeError(
            _("This expression exists, but it can't be used on this object."),
            function.objectNameLocation);
        return StringToType(metadata.GetReturnType());
      }
    }
  }

  Type returnType = StringToType(metadata.GetReturnType());

  if (gd::MetadataProvider::IsBadExpressionMetadata(metadata)) {
    RaiseError(
        "invalid_function_name",
        _("Cannot find an expression with this name: ") +
            function.functionName + "\n" +
            _("Double check that you've not made any typo in the name."),
        function.location);
      return returnType;
  }

  // Validate the type of the function
  if (returnType == Type::Number) {
    if (parentType == Type::String) {
      RaiseTypeError(
          _("You tried to use an expression that returns a number, but a "
            "string is expected. Use `ToString` if you need to convert a "
            "number to a string."),
          function.location);
      return returnType;
    }
    else if (parentType != Type::Number && parentType != Type::NumberOrString) {
      RaiseTypeError(_("You tried to use an expression that returns a "
                              "number, but another type is expected:") +
                              " " + TypeToSting(parentType),
                            function.location);
      return returnType;
    }
  } else if (returnType == Type::String) {
    if (parentType == Type::Number) {
      RaiseTypeError(
          _("You tried to use an expression that returns a string, but a "
            "number is expected. Use `ToNumber` if you need to convert a "
            "string to a number."),
          function.location);
      return returnType;
    }
    else if (parentType != Type::String && parentType != Type::NumberOrString) {
      RaiseTypeError(_("You tried to use an expression that returns a "
                              "string, but another type is expected:") +
                              " " + TypeToSting(parentType),
                            function.location);
      return returnType;
    }
  } else {
    if (parentType != returnType) {
      RaiseTypeError(
          _("You tried to use an expression with the wrong return type:") + " " +
            TypeToSting(returnType),
          function.location);
      return returnType;
    }
  }

  // Validate parameters count
  size_t minParametersCount = GetMinimumParametersNumber(
      metadata.parameters,
      ExpressionParser2::WrittenParametersFirstIndex(function.objectName, function.behaviorName));
  size_t maxParametersCount = GetMaximumParametersNumber(
      metadata.parameters,
      ExpressionParser2::WrittenParametersFirstIndex(function.objectName, function.behaviorName));
  if (function.parameters.size() < minParametersCount ||
      function.parameters.size() > maxParametersCount) {
    gd::String expectedCountMessage =
        minParametersCount == maxParametersCount
            ? _("The number of parameters must be exactly ") +
                  gd::String::From(minParametersCount)
            : _("The number of parameters must be: ") +
                  gd::String::From(minParametersCount) + "-" +
                  gd::String::From(maxParametersCount);

    if (function.parameters.size() < minParametersCount) {
      RaiseError(
          "too_few_parameters",
          _("You have not entered enough parameters for the expression.") + " " +
              expectedCountMessage,
          function.location);
    }
    else {
      RaiseError(
          "extra_parameter",
          _("This parameter was not expected by this expression. Remove it "
          "or verify that you've entered the proper expression name.") + " " +
              expectedCountMessage,
          ExpressionParserLocation(
              function.parameters[maxParametersCount]->location.GetStartPosition(),
              function.location.GetEndPosition() - 1));
    }
    return returnType;
  }

  // TODO: reverse the order of diagnostic?
  size_t writtenParametersFirstIndex =
      ExpressionParser2::WrittenParametersFirstIndex(
          function.objectName, function.behaviorName);
  int metadataIndex = writtenParametersFirstIndex;
  for (int parameterIndex = 0; parameterIndex < function.parameters.size(); parameterIndex++) {
    auto& parameter = function.parameters[parameterIndex];
    while (metadata.GetParameters()[metadataIndex].IsCodeOnly()) {
      // The sizes are already checked above.
      metadataIndex++;
    }
    auto& parameterMetadata = metadata.GetParameters()[metadataIndex];

    if (!parameterMetadata.IsOptional() || dynamic_cast<EmptyNode*>(parameter.get()) == nullptr) {
      auto currentParentType = parentType;
      parentType = StringToType(parameterMetadata.GetType());
      parameter->Visit(*this);
      parentType = currentParentType;
      
      const gd::String &expectedParameterType = parameterMetadata.GetType();
      if (gd::ParameterMetadata::IsExpression("number", expectedParameterType)) {
        if (childType != Type::Number) {
          // TODO error or already checked in children?
        }
      } else if (gd::ParameterMetadata::IsExpression("string", expectedParameterType)) {
        if (childType != Type::String) {
          // TODO error or already checked in children?
        }
      } else if (gd::ParameterMetadata::IsExpression("variable", expectedParameterType)) {
        if (childType != Type::Variable) {
          // TODO error or already checked in children?
        }
      } else if (gd::ParameterMetadata::IsObject(expectedParameterType)) {
        if (auto identifierNode =
          dynamic_cast<IdentifierNode *>(parameter.get())) {
          // Memorize the last object name. By convention, parameters that
          // require an object (mainly, "objectvar" and "behavior") should be
          // placed after the object in the list of parameters (if possible,
          // just after). Search "lastObjectName" in the codebase for other
          // place where this convention is enforced.
          lastObjectName = identifierNode->identifierName;
        }
        else {
          RaiseError(
                  "malformed_object_parameter",
                  _("An object name was expected but something else was "
                    "written. Enter just the name of the object for this "
                    "parameter."),
                parameter->location);
        }
      } else {
        RaiseError(
                "unknown_parameter_type",
                _("This function is improperly set up. Reach out to the "
                  "extension developer or a GDevelop maintainer to fix "
                  "this issue"),
                parameter->location);
      }
    }
    metadataIndex++;
  }
  return returnType;
}

  // TODO factorize
  const gd::String ExpressionValidator::unknownTypeString = "unknown";
  const gd::String ExpressionValidator::numberTypeString = "number";
  const gd::String ExpressionValidator::stringTypeString = "string";
  const gd::String ExpressionValidator::numberOrStringTypeString = "number|string";
  const gd::String ExpressionValidator::variableTypeString = "variable";
  const gd::String ExpressionValidator::objectTypeString = "object";
  const gd::String ExpressionValidator::emptyTypeString = "empty";

  const gd::String &ExpressionValidator::TypeToSting(Type type) {
    switch (type) {
      case Type::Unknown:
      return unknownTypeString;
      case Type::Number:
      return numberTypeString;
      case Type::String:
      return stringTypeString;
      case Type::NumberOrString:
      return numberOrStringTypeString;
      case Type::Variable:
      return variableTypeString;
      case Type::Object:
      return objectTypeString;
      case Type::Empty:
      return emptyTypeString;
    }
    return unknownTypeString;
  }

  ExpressionValidator::Type ExpressionValidator::StringToType(const gd::String &type) {
    if (type == "number" || gd::ParameterMetadata::IsExpression("number", type)) {
      return Type::Number;
    }
    if (type == "string" || gd::ParameterMetadata::IsExpression("string", type)) {
      return Type::String;
    }
    if (type == "number|string") {
      return Type::NumberOrString;
    }
    if (type == "variable" || gd::ParameterMetadata::IsExpression("variable", type)) {
      return Type::Variable;
    }
    if (type == "object" || gd::ParameterMetadata::IsObject(type)) {
      return Type::Object;
    }
    return Type::Unknown;
  }
}  // namespace gd
