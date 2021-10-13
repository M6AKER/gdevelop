/*
 * GDevelop JS Platform
 * Copyright 2008-2016 Florian Rival (Florian.Rival@gmail.com). All rights
 * reserved. This project is released under the MIT License.
 */
#include "AdvancedExtension.h"

#include "GDCore/CommonTools.h"
#include "GDCore/Events/CodeGeneration/EventsCodeGenerationContext.h"
#include "GDCore/Events/CodeGeneration/EventsCodeGenerator.h"
#include "GDCore/Events/CodeGeneration/ExpressionCodeGenerator.h"
#include "GDCore/Extensions/Builtin/AllBuiltinExtensions.h"
#include "GDCore/Tools/Localization.h"

namespace gdjs {

AdvancedExtension::AdvancedExtension() {
  gd::BuiltinExtensionsImplementer::ImplementsAdvancedExtension(*this);

  GetAllConditions()["Toujours"].SetFunctionName(
      "gdjs.evtTools.common.logicalNegation");

  GetAllActions()["SetReturnNumber"]
      .GetCodeExtraInformation()
      .SetCustomCodeGenerator([](gd::Instruction& instruction,
                                 gd::EventsCodeGenerator& codeGenerator,
                                 gd::EventsCodeGenerationContext& context) {
        gd::String expressionCode =
            gd::ExpressionCodeGenerator::GenerateExpressionCode(
                codeGenerator,
                context,
                "number",
                instruction.GetParameter(0).GetPlainString());

        return "if (typeof eventsFunctionContext !== 'undefined') { "
               "eventsFunctionContext.returnValue = " +
               expressionCode + "; }";
      });

  GetAllActions()["SetReturnString"]
      .GetCodeExtraInformation()
      .SetCustomCodeGenerator([](gd::Instruction& instruction,
                                 gd::EventsCodeGenerator& codeGenerator,
                                 gd::EventsCodeGenerationContext& context) {
        gd::String expressionCode =
            gd::ExpressionCodeGenerator::GenerateExpressionCode(
                codeGenerator,
                context,
                "string",
                instruction.GetParameter(0).GetPlainString());

        return "if (typeof eventsFunctionContext !== 'undefined') { "
               "eventsFunctionContext.returnValue = " +
               expressionCode + "; }";
      });

  GetAllActions()["SetReturnBoolean"]
      .GetCodeExtraInformation()
      .SetCustomCodeGenerator([](gd::Instruction& instruction,
                                 gd::EventsCodeGenerator& codeGenerator,
                                 gd::EventsCodeGenerationContext& context) {
        // This is duplicated from EventsCodeGenerator::GenerateParameterCodes
        gd::String parameter = instruction.GetParameter(0).GetPlainString();
        gd::String booleanCode =
            (parameter == "True" || parameter == "Vrai") ? "true" : "false";

        return "if (typeof eventsFunctionContext !== 'undefined') { "
               "eventsFunctionContext.returnValue = " +
               booleanCode + "; }";
      });

  GetAllActions()["SetReturnObject"]
      .GetCodeExtraInformation()
      .SetCustomCodeGenerator([](gd::Instruction& instruction,
                                 gd::EventsCodeGenerator& codeGenerator,
                                 gd::EventsCodeGenerationContext& context) {
        const gd::String& objectName = codeGenerator.ConvertToStringExplicit(instruction.GetParameter(0).GetPlainString());
        const gd::String& objectList = codeGenerator.GetObjectListName(instruction.GetParameter(0).GetPlainString(), context);
        return "if (typeof eventsFunctionContext !== 'undefined') {"
               "  eventsFunctionContext.returnValue = true;"
               "  const lists = eventsFunctionContext.getObjectsLists("+objectName+");"
               // Clear picked objects list...
               "  for (const list of Object.values(lists.items)) list.length = 0;"
               // ...and pick one by one each objects that need to be picked.
               "  for(const o of "+objectList+") lists.get(o.getName()).push(o);"
               "}";
      });

  GetAllConditions()["GetArgumentAsBoolean"]
      .GetCodeExtraInformation()
      .SetCustomCodeGenerator([](gd::Instruction& instruction,
                                 gd::EventsCodeGenerator& codeGenerator,
                                 gd::EventsCodeGenerationContext& context) {
        gd::String parameterNameCode =
            gd::ExpressionCodeGenerator::GenerateExpressionCode(
                codeGenerator,
                context,
                "string",
                instruction.GetParameter(0).GetPlainString());
        gd::String valueCode =
            gd::String(instruction.IsInverted() ? "!" : "") +
            "(typeof eventsFunctionContext !== 'undefined' ? "
            "!!eventsFunctionContext.getArgument(" +
            parameterNameCode + ") : false)";
        gd::String outputCode =
            codeGenerator.GenerateBooleanFullName("conditionTrue", context) +
            ".val = " + valueCode + ";\n";
        return outputCode;
      });

  GetAllExpressions()["GetArgumentAsNumber"]
      .GetCodeExtraInformation()
      .SetCustomCodeGenerator([](const std::vector<gd::Expression>& parameters,
                                 gd::EventsCodeGenerator& codeGenerator,
                                 gd::EventsCodeGenerationContext& context) {
        gd::String parameterNameCode =
            gd::ExpressionCodeGenerator::GenerateExpressionCode(
                codeGenerator,
                context,
                "string",
                !parameters.empty() ? parameters[0].GetPlainString() : "");

        return "(typeof eventsFunctionContext !== 'undefined' ? "
               "Number(eventsFunctionContext.getArgument(" +
               parameterNameCode + ")) || 0 : 0)";
      });

  GetAllStrExpressions()["GetArgumentAsString"]
      .GetCodeExtraInformation()
      .SetCustomCodeGenerator([](const std::vector<gd::Expression>& parameters,
                                 gd::EventsCodeGenerator& codeGenerator,
                                 gd::EventsCodeGenerationContext& context) {
        gd::String parameterNameCode =
            gd::ExpressionCodeGenerator::GenerateExpressionCode(
                codeGenerator,
                context,
                "string",
                !parameters.empty() ? parameters[0].GetPlainString() : "");

        return "(typeof eventsFunctionContext !== 'undefined' ? \"\" + "
               "eventsFunctionContext.getArgument(" +
               parameterNameCode + ") : \"\")";
      });
}

}  // namespace gdjs
