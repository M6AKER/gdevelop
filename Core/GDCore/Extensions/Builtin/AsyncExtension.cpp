/*
 * GDevelop Core
 * Copyright 2008-2016 Florian Rival (Florian.Rival@gmail.com). All rights
 * reserved. This project is released under the MIT License.
 */
#include "AllBuiltinExtensions.h"
#include "GDCore/Events/Builtin/AsyncEvent.h"
#include "GDCore/Tools/Localization.h"

using namespace std;
namespace gd {

void GD_CORE_API BuiltinExtensionsImplementer::ImplementsAsyncExtension(
    gd::PlatformExtension &extension) {
  extension
      .SetExtensionInformation(
          "BuiltinAsync",
          _("Async functions"),
          _("Functions that defer the execution of the events after it."),
          "Arthur Pacaud (arthuro555)",
          "Open source (MIT License)")
      .SetCategory("Advanced");

  extension.AddEvent("Async",
                     _("Async event"),
                     _("Internal event for asynchronous actions"),
                     "",
                     "res/eventaddicon.png",
                     std::make_shared<gd::AsyncEvent>());

  extension
      .AddAction(
          "ResolveAsyncEventsFunction",
          _("End asynchronous function"),
          _("Mark an asynchronous function as finished. This will allow the "
            "actions and subevents following it to be run."),
          "Mark asynchronous function as ended",
          "",
          "",
          "")
      .AddCodeOnlyParameter("eventsFunctionContext", "");
}

}  // namespace gd
