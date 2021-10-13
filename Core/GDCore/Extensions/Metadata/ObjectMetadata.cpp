/*
 * GDevelop Core
 * Copyright 2008-2016 Florian Rival (Florian.Rival@gmail.com). All rights
 * reserved. This project is released under the MIT License.
 */
#include "ObjectMetadata.h"

#include <algorithm>
#include <iostream>

#include "GDCore/Extensions/Metadata/ExpressionMetadata.h"
#include "GDCore/Extensions/Metadata/InstructionMetadata.h"
#include "GDCore/Extensions/Metadata/MultipleInstructionMetadata.h"
#include "GDCore/Extensions/PlatformExtension.h"
#include "GDCore/Project/Object.h"
#include "GDCore/Tools/Localization.h"

namespace gd {

ObjectMetadata::ObjectMetadata(const gd::String& extensionNamespace_,
                               const gd::String& name_,
                               const gd::String& fullname_,
                               const gd::String& description_,
                               const gd::String& icon24x24,
                               std::shared_ptr<gd::Object> blueprintObject_)
    : extensionNamespace(extensionNamespace_),
      blueprintObject(blueprintObject_) {
  name = name_;
  SetFullName(gd::String(fullname_));
  SetDescription(gd::String(description_));
  iconFilename = icon24x24;
  createFunPtr =
      [blueprintObject_](gd::String name) -> std::unique_ptr<gd::Object> {
    if (blueprintObject_ == std::shared_ptr<gd::Object>()) {
      std::cout
          << "Error: Unable to create object. Have you declared an extension "
             "(or ObjectMetadata) without specifying an object as blueprint?"
          << std::endl;
      return nullptr;
    }

    std::unique_ptr<gd::Object> newObject = blueprintObject_->Clone();
    newObject->SetName(name);
    return newObject;
  };
}

ObjectMetadata::ObjectMetadata(const gd::String& extensionNamespace_,
                               const gd::String& name_,
                               const gd::String& fullname_,
                               const gd::String& description_,
                               const gd::String& icon24x24,
                               CreateFunPtr createFunPtrP)
    : extensionNamespace(extensionNamespace_) {
  name = name_;
  SetFullName(gd::String(fullname_));
  SetDescription(gd::String(description_));
  iconFilename = icon24x24;
  createFunPtr = createFunPtrP;
}

gd::InstructionMetadata& ObjectMetadata::AddCondition(
    const gd::String& name,
    const gd::String& fullname,
    const gd::String& description,
    const gd::String& sentence,
    const gd::String& group,
    const gd::String& icon,
    const gd::String& smallicon) {
  gd::String nameWithNamespace =
      extensionNamespace.empty() ? name : extensionNamespace + name;
  conditionsInfos[nameWithNamespace] = InstructionMetadata(extensionNamespace,
                                                           nameWithNamespace,
                                                           fullname,
                                                           description,
                                                           sentence,
                                                           group,
                                                           icon,
                                                           smallicon)
                                           .SetHelpPath(GetHelpPath())
                                           .SetIsObjectInstruction();
  return conditionsInfos[nameWithNamespace];
}

gd::InstructionMetadata& ObjectMetadata::AddAction(
    const gd::String& name,
    const gd::String& fullname,
    const gd::String& description,
    const gd::String& sentence,
    const gd::String& group,
    const gd::String& icon,
    const gd::String& smallicon) {
  gd::String nameWithNamespace =
      extensionNamespace.empty() ? name : extensionNamespace + name;
  actionsInfos[nameWithNamespace] = InstructionMetadata(extensionNamespace,
                                                        nameWithNamespace,
                                                        fullname,
                                                        description,
                                                        sentence,
                                                        group,
                                                        icon,
                                                        smallicon)
                                        .SetHelpPath(GetHelpPath())
                                        .SetIsObjectInstruction();
  return actionsInfos[nameWithNamespace];
}

gd::InstructionMetadata& ObjectMetadata::AddScopedCondition(
    const gd::String& name,
    const gd::String& fullname,
    const gd::String& description,
    const gd::String& sentence,
    const gd::String& group,
    const gd::String& icon,
    const gd::String& smallicon) {
  gd::String nameWithNamespace =
      GetName().empty()
          ? name  // Don't insert a namespace separator for the base object.
          : GetName() + gd::PlatformExtension::GetNamespaceSeparator() + name;

  conditionsInfos[nameWithNamespace] = InstructionMetadata(extensionNamespace,
                                                           nameWithNamespace,
                                                           fullname,
                                                           description,
                                                           sentence,
                                                           group,
                                                           icon,
                                                           smallicon)
                                           .SetHelpPath(GetHelpPath())
                                           .SetIsObjectInstruction();
  return conditionsInfos[nameWithNamespace];
}

gd::InstructionMetadata& ObjectMetadata::AddScopedAction(
    const gd::String& name,
    const gd::String& fullname,
    const gd::String& description,
    const gd::String& sentence,
    const gd::String& group,
    const gd::String& icon,
    const gd::String& smallicon) {
  gd::String nameWithNamespace =
      GetName().empty()
          ? name  // Don't insert a namespace separator for the base object.
          : GetName() + gd::PlatformExtension::GetNamespaceSeparator() + name;

  actionsInfos[nameWithNamespace] = InstructionMetadata(extensionNamespace,
                                                        nameWithNamespace,
                                                        fullname,
                                                        description,
                                                        sentence,
                                                        group,
                                                        icon,
                                                        smallicon)
                                        .SetHelpPath(GetHelpPath())
                                        .SetIsObjectInstruction();
  return actionsInfos[nameWithNamespace];
}

gd::ExpressionMetadata& ObjectMetadata::AddExpression(
    const gd::String& name,
    const gd::String& fullname,
    const gd::String& description,
    const gd::String& group,
    const gd::String& smallicon) {
  // Be careful, objects expression do not have namespace (not necessary as
  // objects inherits from only one derived object).
  expressionsInfos[name] = ExpressionMetadata("number",
                                              extensionNamespace,
                                              name,
                                              fullname,
                                              description,
                                              group,
                                              smallicon)
                               .SetHelpPath(GetHelpPath());

  return expressionsInfos[name];
}

gd::ExpressionMetadata& ObjectMetadata::AddStrExpression(
    const gd::String& name,
    const gd::String& fullname,
    const gd::String& description,
    const gd::String& group,
    const gd::String& smallicon) {
  // Be careful, objects expression do not have namespace (not necessary as
  // objects inherits from only one derived object).
  strExpressionsInfos[name] = ExpressionMetadata("string",
                                                 extensionNamespace,
                                                 name,
                                                 fullname,
                                                 description,
                                                 group,
                                                 smallicon)
                                  .SetHelpPath(GetHelpPath());

  return strExpressionsInfos[name];
}

gd::ExpressionMetadata& ObjectMetadata::AddVariableExpression(
    const gd::String& name,
    const gd::String& fullname,
    const gd::String& description,
    const gd::String& group,
    const gd::String& smallicon) {
  // Be careful, objects expression do not have namespace (not necessary as
  // objects inherits from only one derived object).
  variableExpressionsInfos[name] = ExpressionMetadata("variable",
                                                      extensionNamespace,
                                                      name,
                                                      fullname,
                                                      description,
                                                      group,
                                                      smallicon)
                                       .SetHelpPath(GetHelpPath());

  return variableExpressionsInfos[name];
}

gd::MultipleInstructionMetadata ObjectMetadata::AddExpressionAndCondition(
    const gd::String& type,
    const gd::String& name,
    const gd::String& fullname,
    const gd::String& descriptionSubject,
    const gd::String& sentenceName,
    const gd::String& group,
    const gd::String& icon) {
  gd::String expressionDescriptionTemplate = _("Return <subject>.");
  auto& expression =
      type == "number"
          ? AddExpression(name,
                          fullname,
                          expressionDescriptionTemplate.FindAndReplace(
                              "<subject>", descriptionSubject),
                          group,
                          icon)
      : type == "string"
          ? AddStrExpression(name,
                             fullname,
                             expressionDescriptionTemplate.FindAndReplace(
                                 "<subject>", descriptionSubject),
                             group,
                             icon)
          : AddVariableExpression(name,
                                  fullname,
                                  expressionDescriptionTemplate.FindAndReplace(
                                      "<subject>", descriptionSubject),
                                  group,
                                  icon);

  gd::String conditionDescriptionTemplate = _("Compare <subject>.");
  auto& condition =
      AddScopedCondition(name,
                         fullname,
                         conditionDescriptionTemplate.FindAndReplace(
                             "<subject>", descriptionSubject),
                         sentenceName,
                         group,
                         icon,
                         icon);

  return MultipleInstructionMetadata::WithExpressionAndCondition(expression,
                                                                 condition);
}

gd::MultipleInstructionMetadata
ObjectMetadata::AddExpressionAndConditionAndAction(
    const gd::String& type,
    const gd::String& name,
    const gd::String& fullname,
    const gd::String& descriptionSubject,
    const gd::String& sentenceName,
    const gd::String& group,
    const gd::String& icon) {
  gd::String expressionDescriptionTemplate = _("Return <subject>.");
  auto& expression =
      type == "number"
          ? AddExpression(name,
                          fullname,
                          expressionDescriptionTemplate.FindAndReplace(
                              "<subject>", descriptionSubject),
                          group,
                          icon)
      : type == "string"
          ? AddStrExpression(name,
                             fullname,
                             expressionDescriptionTemplate.FindAndReplace(
                                 "<subject>", descriptionSubject),
                             group,
                             icon)
          : AddVariableExpression(name,
                                  fullname,
                                  expressionDescriptionTemplate.FindAndReplace(
                                      "<subject>", descriptionSubject),
                                  group,
                                  icon);

  gd::String conditionDescriptionTemplate = _("Compare <subject>.");
  auto& condition =
      AddScopedCondition(name,
                         fullname,
                         conditionDescriptionTemplate.FindAndReplace(
                             "<subject>", descriptionSubject),
                         sentenceName,
                         group,
                         icon,
                         icon);

  gd::String actionDescriptionTemplate = _("Change <subject>.");
  auto& action = AddScopedAction(
      "Set" + name,
      fullname,
      actionDescriptionTemplate.FindAndReplace("<subject>", descriptionSubject),
      sentenceName,
      group,
      icon,
      icon);

  return MultipleInstructionMetadata::WithExpressionAndConditionAndAction(
      expression, condition, action);
}

gd::InstructionMetadata& ObjectMetadata::AddDuplicatedAction(
    const gd::String& newActionName, const gd::String& copiedActionName) {
  gd::String newNameWithNamespace = extensionNamespace + newActionName;
  gd::String copiedNameWithNamespace = extensionNamespace + copiedActionName;

  auto copiedAction = actionsInfos.find(copiedNameWithNamespace);
  if (copiedAction == actionsInfos.end()) {
    gd::LogWarning("Could not find an action with name " +
                   copiedNameWithNamespace + " to copy.");
  } else {
    actionsInfos[newNameWithNamespace] = copiedAction->second;
  }

  return actionsInfos[newNameWithNamespace];
}

gd::InstructionMetadata& ObjectMetadata::AddDuplicatedCondition(
    const gd::String& newConditionName, const gd::String& copiedConditionName) {
  gd::String newNameWithNamespace = extensionNamespace + newConditionName;
  gd::String copiedNameWithNamespace = extensionNamespace + copiedConditionName;

  auto copiedCondition = conditionsInfos.find(copiedNameWithNamespace);
  if (copiedCondition == conditionsInfos.end()) {
    gd::LogWarning("Could not find a condition with name " +
                   copiedNameWithNamespace + " to copy.");
  } else {
    conditionsInfos[newNameWithNamespace] = copiedCondition->second;
  }

  return conditionsInfos[newNameWithNamespace];
}

ObjectMetadata& ObjectMetadata::SetFullName(const gd::String& fullname_) {
  fullname = fullname_;
  return *this;
}

ObjectMetadata& ObjectMetadata::SetHelpUrl(const gd::String& helpUrl_) {
  helpUrl = helpUrl_;
  return *this;
}

ObjectMetadata& ObjectMetadata::SetDescription(const gd::String& description_) {
  description = description_;
  return *this;
}

ObjectMetadata& ObjectMetadata::SetIncludeFile(const gd::String& includeFile) {
  includeFiles.clear();
  includeFiles.push_back(includeFile);
  return *this;
}
ObjectMetadata& ObjectMetadata::AddIncludeFile(const gd::String& includeFile) {
  if (std::find(includeFiles.begin(), includeFiles.end(), includeFile) ==
      includeFiles.end())
    includeFiles.push_back(includeFile);
  return *this;
}

}  // namespace gd
